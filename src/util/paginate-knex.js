'use strict';
module.exports = function (KnexQueryBuilder){
  KnexQueryBuilder.prototype.paginate = function (per_page = 5, page = 1, orderingObject ={column: '', direction: ''}) { //it throws an error because I havent filled in here for pagination
    const pagination = {};
    if (page < 1) page = 1;
    var offset = (page - 1) * per_page;
    return Promise.all([
      this.clone().count('* as count').first(), //returns count of how many rows
      this.orderBy(orderingObject.column, orderingObject.direction).offset(offset).limit(per_page)//select the column to order by and the direction
    ])
      .then(([total, rows]) => {
        const count = total.count;
        pagination.total = count;
        pagination.per_page = per_page;
        pagination.offset = offset;
        pagination.to = offset + rows.length;
        pagination.last_page = Math.ceil(count / per_page);
        pagination.current_page = page;
        pagination.from = offset;
        pagination.data = rows;
        return pagination;
      });
  };
};