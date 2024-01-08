import SearchInfo from '@/model/common/SearchInfo';
import moment from 'moment/moment';

class SocialContributePointSearchDto extends SearchInfo {
    constructor() {
        super();
        this.params.startDate = moment().subtract(1, "day").format("YYYY-MM-DD");
        this.params.endDate = moment().format("YYYY-MM-DD");
        this.params.pointType = 1;
        this.params.point = '';
        this.params.userId = '';
    }
}

export default SocialContributePointSearchDto;