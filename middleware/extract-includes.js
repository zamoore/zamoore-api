'use strict';

const Boom = require('boom');

module.exports = (mapping) => {
  return (request, h) => {
    let includeArray;
    let includeString = request.query.include;

    if (includeString === undefined) {
      return null;
    }

    includeArray = includeString.split(',').reduce((acc, include) => {
      let mappedInclude = mapping[include];

      if (mappedInclude) {
        acc.push(mappedInclude);
      }

      return acc;
    }, []);

    if (includeArray.length === 0) {
      throw Boom.badRequest('invalid include options');
    }

    return includeArray;
  };
};
