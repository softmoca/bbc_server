import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dto/base-pagination.dto';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BaseModel } from 'src/entities/base.entity';
import { FILTER_MAPPER } from './const/filter-mapper.const';

@Injectable()
export class CommonService {
  async paginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    // find option 중 강제로 덮어쓰고 싶은 데이터 넣는 곳
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    if (dto.page) {
      return this.pagePaginate(
        dto,
        repository,
        // find option 중 강제로 덮어쓰고 싶은 데이터 넣는 곳
        overrideFindOptions,
      );
    } else {
      return this.cursorPaginate(dto, repository, overrideFindOptions, path);
    }
  }

  async pagePaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,

    overrideFindOptions: FindManyOptions<T> = {},
  ) {}

  async cursorPaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,

    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {}

  // where,order,take,skip을 반환해야한다.

  //  1) where로 시작한다면 필터 로직을 적용한다.
  //  2) order로 시작한다면 정렬 로직을 적용한다.
  //  3) 필터 로직을 적용한다면 '__' 기준으로 split 했을때 3개의 값으로 나뉘는지
  //     2개의 값으로 나뉘는지 확인한다.
  //     1) 3개의 값으로 나뉜다면 FILTER_MAPPER에서 해당되는 operator 함수를
  //        찾아서 적용한다.
  //     2) 만약에 2개의 값으로 나뉜다면 정확한 값을 필터하는 것이기 때문에
  //        operator 없이 적용한다.
  //  4) order의 경우 3-2와 같이 적용한다.

  composeFindOptions<T extends BaseModel>(
    dto: BasePaginationDto,
  ): FindManyOptions<T> {
    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};
    for (const [key, value] of Object.entries(dto)) {
      // where__로 시작하면 where 필터를 파싱한다.
      if (key.startsWith('where__')) {
        where = {
          ...where,
          ...this.parseWhereFilter(key, value),
        };
      } else if (key.startsWith('order__')) {
        // order__로 시작하면 order 필터를 파싱한다.
        order = {
          ...order,
          ...this.parseOrderFilter(key, value),
        };
      }
    }

    return {
      where,
      order,
      take: dto.take,
      skip: dto.page ? dto.take * (dto.page - 1) : null,
    };
  }

  private parseOrderFilter<T extends BaseModel>(
    key: string,
    value: string,
  ): FindOptionsOrder<T> {}

  private parseWhereFilter<T extends BaseModel>(
    key: string,
    value: string,
  ): FindOptionsWhere<T> {
    const where: FindOptionsWhere<T> = {};

    // 예를들어 where__id__more_than 는 ['where', 'id', 'more_than'] 으로 나눌 수 있다.
    const split = key.split('__');

    if (split.length !== 2 && split.length !== 3) {
      throw new BadRequestException(
        `where 필터는 '__'로 split 했을때 길이가 2 또는 3이어야합니다 - 문제되는 키값 : ${key}`,
      );
    }

    //   길이가 2일경우는   where__id = 3
    //   FindOptionsWhere로 풀어보면
    //   {
    //    where:{
    //        id: 3
    //    }
    //   }
    if (split.length === 2) {
      const [_, field] = split;
      where[field] = value; // id가 field로 들어간다.
    } else {
      //길이가 3일 경우에는 Typeorm 유틸리티가 적용 필요한 경우다.

      // where__id__more_than의 경우  where는 버려도 되고 두번째 값은 필터할 키값, 세번째 값은 오퍼레이터 유틸리티
      // FILTER_MAPPER에 미리 정의해둔 값들로 field 값에 FILTER_MAPPER에서 해당되는 utility를 가져와 적용
      const [_, field, operator] = split;
      const values = value.toString().split(',');
      where[field] = FILTER_MAPPER[operator](
        values.length > 1 ? values : value,
      );
    }

    return where;
  }
}
