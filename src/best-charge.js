const {loadAllItems} = require('./items');
const {loadPromotions} = require('./promotions');

function bestCharge(Inputs) {
  //格式化数据，获取商品的种类和数量
  let itemsTypeAndNum=formatInputs(Inputs);
  //映射商品信息
  let itemsdetail=fIndItemDetail(itemsTypeAndNum);
  //初始化没有优惠
  let bestPromotion=[{type:"",save:"",sum:calculateCartSum(itemsdetail)}];
  //判断商品列表能不能达到使用优惠的条件
  let hasDiscount=isDiscount(itemsdetail);
  if(hasDiscount){
    //计算优惠方式一
    discoutforHalfReduce=countDiscoutforHalfReduce(itemsdetail);
    //计算优方式二
    discoutforFullReduce=countDiscoutforFullReduce(itemsdetail);
    //选择最佳
    bestPromotion=selectBestPromotion(discoutforHalfReduce,discoutforFullReduce);
  }
  //生成清单
  let bill=buildBill(itemsdetail,bestPromotion);
  return bill;

}

function  formatInputs(Inputs) {
   let itemsTypeAndNum=[];
   for(let item of Inputs){
     let splitStr=item.split(" x ");
     itemsTypeAndNum.push(
       {
         id:splitStr[0],
         num:splitStr[1]
       }
     );
   }
  return itemsTypeAndNum;
}

function fIndItemDetail(itemsTypeAndNum) {
  let itemDetail=[];
  let allItems=loadAllItems();
  for(let cartItem of itemsTypeAndNum) {
    for (let item of allItems) {
      if (cartItem.id === item.id) {
        itemDetail.push({
          id: cartItem.id,
          name: item.name,
          price: item.price,
          num: cartItem.num,
          subtotal:item.price*cartItem.num
        });
      }
    }
  }
  return itemDetail;
}

//计算商品总价
function calculateCartSum(itemsdetail) {
  let sum=0;
  for(let item of itemsdetail){
    sum+=item.price*item.num;
  }
  return sum;
}

//判断有木有的优惠
function isDiscount(itemsdetail) {
  let promotions=loadPromotions();
  let hasDiscount=true;
  discountItems=promotions[1].items;
  for(let cartItem of itemsdetail){
    for(let item  of discountItems){
      if(cartItem.id!==item&&calculateCartSum(itemsdetail)<30){
        //不在指定半价内而且总价少于30
        hasDiscount=false;
      }
    }
  }
  return hasDiscount;
}

//计算半价优惠
function countDiscoutforHalfReduce(itemsdetail) {
  let save=0;
  let sum=0;
  let type="指定菜品半价(";
  let allpromotions=loadPromotions();
  let halfitem=allpromotions[1].items;
  for(let cartItem of itemsdetail){
    for (let itemDiscount of halfitem ){
      if(cartItem.id===itemDiscount){
        type+=cartItem.name;
        save+=cartItem.subtotal/2;
        type += "，";
        break;
      }
    }
  }
  type = type.substring(0,type.length-1);
  type += ")";
  sum=calculateCartSum(itemsdetail)-save;
  let discountContent=[{type:type,save:save,sum:sum}];
  return discountContent;
}


//计算满30-6优惠
function countDiscoutforFullReduce(itemsdetail) {
  let type="满30减6元";
  let save=6;
  let sum=calculateCartSum(itemsdetail)-6;
  let discountContent=[{type:type,save:save,sum:sum}];
  return discountContent;

}

//选择最优惠的方案
function  selectBestPromotion(discountContent1,discountContent2) {
    let bestPromotion=[];
    let save1=discountContent1[0].save;
    let save2=discountContent2[0].save;
    if(save1>save2){
      bestPromotion=discountContent1;
    }else{
      bestPromotion=discountContent2;
    }
    return bestPromotion;
}

function buildBill(itemsdetail,bestPromotion) {
  let type = bestPromotion[0].type;
  let save = bestPromotion[0].save;
  let sum = bestPromotion[0].sum;
  let promotion ="";
  let str = "";
  for(let item of itemsdetail){
    str += `${item.name} x ${item.num} = ${item.subtotal}元\n`
  }
  if(type!=""){
    promotion = `使用优惠:${type}，省${save}元
-----------------------------------
`
  }
  let receiptToString = `============= 订餐明细 =============
${str}-----------------------------------
${promotion}总计：${sum}元
===================================`;
  return receiptToString;
}
module.exports = {bestCharge, formatInputs, fIndItemDetail,calculateCartSum, isDiscount,countDiscoutforHalfReduce, countDiscoutforFullReduce, selectBestPromotion, buildBill};





