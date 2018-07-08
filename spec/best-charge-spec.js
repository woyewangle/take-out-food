const {bestCharge, formatInputs, fIndItemDetail, calculateCartSum,isDiscount,countDiscoutforHalfReduce, countDiscoutforFullReduce, selectBestPromotion, buildBill}= require('../src/best-charge');

describe('Take out food', function () {



  it('Function formatInputs test', function() {
  let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
  let itemsTypeAndNum = formatInputs(inputs);
  const result=[
    {id: "ITEM0001", num: "1"},
    {id: "ITEM0013", num: "2"},
    {id: "ITEM0022", num: "1"}
  ]
  expect(itemsTypeAndNum).toEqual(result);
});



it('Function fIndItemDetail test', function() {
  let inputs = [
    {id: "ITEM0001", num: "1"},
    {id: "ITEM0013", num: "2"},
    {id: "ITEM0022", num: "1"}
  ];
  let itemsdetail=fIndItemDetail(inputs);
  const result=[
    {id: "ITEM0001", name: "黄焖鸡", price: 18, num: "1",subtotal:18},
    {id: "ITEM0013", name: "肉夹馍", price: 6, num: "2",subtotal:12},
    {id: "ITEM0022", name: "凉皮", price: 8, num: "1",subtotal:8}
  ]
  expect(itemsdetail).toEqual(result);
});


it('Function calculateCartSum test', function() {
  let inputs = [
    {id: "ITEM0001", name: "黄焖鸡", price: 18, num: "1"},
    {id: "ITEM0013", name: "肉夹馍", price: 6, num: "2"},
    {id: "ITEM0022", name: "凉皮", price: 8, num: "1"}
  ];
  let sum=calculateCartSum(inputs);
  const result=38;
  expect(sum).toEqual(result);
});


it('Function isDiscount test', function() {
  let inputs = [
    {id: "ITEM0001", name: "黄焖鸡", price: 18, num: "1"},
    {id: "ITEM0013", name: "肉夹馍", price: 6, num: "2"},
    {id: "ITEM0022", name: "凉皮", price: 8, num: "1"}

  ];
  let hasDiscount=isDiscount(inputs);
  const result=true;
  expect(hasDiscount).toEqual(result);
});


it('Function countDiscoutforHalf test', function() {
  let inputs = [
    {id: "ITEM0001", name: "黄焖鸡", price: 18, num: "1",subtotal:18},
    {id: "ITEM0013", name: "肉夹馍", price: 6, num: "2",subtotal:12},
    {id: "ITEM0022", name: "凉皮", price: 8, num: "1",subtotal:8}

  ];
  let hasDiscount=countDiscoutforHalfReduce(inputs);
  const result=[
    {type:"指定菜品半价(黄焖鸡，凉皮)",save: 13, sum: 25}
  ]
  expect(hasDiscount).toEqual(result);
});


it('Function countDiscoutforFullReduce test', function() {
  let inputs = [
    {id: "ITEM0001", name: "黄焖鸡", price: 18, num: "1",subtotal:18},
    {id: "ITEM0013", name: "肉夹馍", price: 6, num: "2",subtotal:12},
    {id: "ITEM0022", name: "凉皮", price: 8, num: "1",subtotal:8}

  ];
  let hasDiscount=countDiscoutforFullReduce(inputs);
  const result=[
    {type:"满30减6元",save: 6, sum:32 }
  ]
  expect(hasDiscount).toEqual(result);
});


it('Function selectBestPromotion test', function() {
  let input1 =[
    {type:"指定菜品半价(黄焖鸡，凉皮)",save: 13, sum: 25}
  ];
  let input2 =[
    {type:"满30减6元",save: 6, sum:32 }
  ];

  let hasDiscount=selectBestPromotion(input1,input2);
  const result=[
    {type:"指定菜品半价(黄焖鸡，凉皮)",save: 13, sum: 25}
  ]
  expect(hasDiscount).toEqual(result);
});


// it('Function selectBestPromotion test', function() {
//   let input1 =[
//     {type:"指定菜品半价(黄焖鸡，凉皮)",save: 13, sum: 25}
//   ];
//   let inputs = [
//     {id: "ITEM0001", name: "黄焖鸡", price: 18, num: "1",subtotal:18},
//     {id: "ITEM0013", name: "肉夹馍", price: 6, num: "2",subtotal:12},
//     {id: "ITEM0022", name: "凉皮", price: 8, num: "1",subtotal:8}
//
//   ];
//
//   let hasDiscount=buildBill(inputs,input1);
//   const result=[
//     {type:"指定菜品半价(黄焖鸡，凉皮)",save: 13, sum: 25}
//   ]
//   expect(hasDiscount).toEqual(result);
// });



it('should generate best charge when best is 指定菜品半价', function() {
  let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
  let summary = bestCharge(inputs).trim();
  let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim()
  expect(summary).toEqual(expected)
});

it('should generate best charge when best is 满30减6元', function() {
  let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
  let summary = bestCharge(inputs).trim();
  let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim()
  expect(summary).toEqual(expected)
});


it('should generate best charge when no promotion can be used', function() {
  let inputs = ["ITEM0013 x 4"];
  let summary = bestCharge(inputs).trim();
  let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim()
  expect(summary).toEqual(expected)
});

});
