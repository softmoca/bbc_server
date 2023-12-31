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
import { HOST, PROTOCOL } from './const/env.const';
import { Post } from 'src/entities/Post';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/entities/Board.entity';
import { fileURLToPath } from 'url';

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
    // find option 중 강제로 덮어쓰고 싶은 데이터 넣는 곳
    overrideFindOptions: FindManyOptions<T> = {},
  ) {
    const findOptions = this.composeFindOptions<T>(dto);

    const [posts, count] = await repository.findAndCount({
      ...findOptions,
      ...overrideFindOptions,
    });

    return {
      data: posts,
      total: count,
    };
  }

  async cursorPaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    const findOptions = this.composeFindOptions<T>(dto);

    console.log(findOptions);

    const results = await repository.find({
      ...findOptions,
      ...overrideFindOptions,
    });

    // 실제 반환된 페이지네이션 데이터 Data[];
    const data = results;
    // 마지막 데이터
    const lastItem =
      data.length > 0 && data.length === findOptions.take
        ? data[data.length - 1]
        : null;

    // 다음 커서 생성하기
    const nextUrl = lastItem && new URL(`${PROTOCOL}://${HOST}/${path}`);

    if (nextUrl) {
      /**
       * dto의 키값들을 루핑하면서
       * 키값에 해당되는 벨류가 존재하면
       * param에 그대로 붙여넣는다.
       *
       * 단, where__id_more_than 값만 lastItem의 마지막 값으로 넣어준다.
       */
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (
            key !== 'where__id__more_than' &&
            key !== 'where__id__less_than'
          ) {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }

      let key = null;

      if (dto.order__createdAt === 'ASC') {
        key = 'where__id__more_than';
      } else {
        key = 'where__id__less_than';
      }

      nextUrl.searchParams.append(key, lastItem.id.toString());
    }

    return {
      data,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: data.length,
      next: nextUrl?.toString() ?? null,
    };
  }

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
          ...this.parseWhereFilter(key, value),
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

  private parseWhereFilter<T extends BaseModel>(
    key: string,
    value: string,
  ): FindOptionsWhere<T> | FindOptionsOrder<T> {
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

      if (field == 'board') {
        where[field] = { id: parseInt(value) };
      } else {
        where[field] = FILTER_MAPPER[operator](
          values.length > 1 ? values : value,
        );
      }
    }

    return where;
  }
}
