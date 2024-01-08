export const numberFormatter = (number:number) => {
        return Number(number).toLocaleString();
}

export const calculatePercentage = (value:number, totalValue:number) => {
	if (totalValue == 0)
		return 0;
    else if((value / totalValue) * 100 == 100) 
        return 100;

	return ((value / totalValue) * 100).toFixed(2); 
}