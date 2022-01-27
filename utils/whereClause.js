//base -> product.find()
//bigQuery -> //search=coder&page=2&category=shortsleeves&rating[gte]=4&price[lte]=999&price[gte]=199

class WhereClause{
    constructor(base, bigQ){
        this.base = base,
        this.bigQ = bigQ
    }

    search(){
        const searchword = this.bigQ.search ? {
            name: {
                $regex: this.bigQ.search,
                options: 'i'
            }
        } : {} 

        this.base =  this.base.find({...searchword});
        return this;
    }

    pager(resultPerPage){
        let currentPage = 1;
        if(this.bigQ.page){
            currentPage = this.bigQ.page;
        }
        const skipVal = resultPerPage * (currentPage-1);
        this.base =  this.base.limit(resultPerPage).skip(skipVal);
        return this;  

    }
}