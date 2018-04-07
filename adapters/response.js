import _ from 'lodash';

import { ApiResponsePageMode } from '../app/configure';

export const responseProxy = {
  extract: apiResponse => global.context.response.extract(apiResponse),
};

export class ResponseAdapter {
  extractPageable = (apiResponse) => {
    switch (ApiResponsePageMode) {
      case (ApiResponsePageMode.SpringJPA): {
        const names = [
          'first',
          'last',
          'number',
          'numberOfElements',
          'size',
          'sort',
          'totalElements',
          'totalPages',
        ];

        const { size, number, totalElements } = _.pick(apiResponse, names);
        return { page: number, size, total: totalElements };
      }
      case (ApiResponsePageMode.SQLAlchemy): {
        const names = [
          'has_next',
          'has_prev',
          'items',
          'page',
          'pages',
          'size',
          'total',
        ];

        const { page, size, total } = _.pick(apiResponse, names);
        return { page, size, total };
      }
      default: {
        const names = ['elements', 'page', 'size', 'total'];

        const { page, size, total } = _.pick(apiResponse, names);
        return { page, size, total };
      }
    }
  };

  extractPagination = (apiResponse) => {
    const { page, size, total: totalElements } = this.extractPageable(apiResponse);
    return {
      showSizeChanger: true,
      showTotal      : (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      current        : page,
      pageSize       : size,
      total          : totalElements,
      pageSizeOptions: ['10', '25', '50', '100'],
    };
  };

  extract = (apiResponse) => {
    const { items } = apiResponse;
    return { items, pagination: this.extractPagination(apiResponse) };
  };
}

