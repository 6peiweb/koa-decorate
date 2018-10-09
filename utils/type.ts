const objToArr = (obj: any) => {
  let arr = [];
  for (let prop in obj) arr.push(obj[prop]);
  return arr;
};

export default { objToArr };
