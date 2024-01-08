import SearchInfo from '@/model/common/SearchInfo';

class CustomerCategoryRatingSearchDto extends SearchInfo {
    constructor() {
        super();
        this.params.categories = [];
        this.params.ratings = [];
    }
}

export default CustomerCategoryRatingSearchDto;