const onBtn = document.getElementById("onBtn");
const offBtn=document.getElementById("offBtn");

// const h1 = document.getElementById("first");
// console.log(h1);

onBtn.addEventListener("click",onTheBulb);
offBtn.addEventListener("click",function (){
    const bulbImg = document.getElementsByTagName("img");
    bulbImg[0].src="off.webp";
})


function onTheBulb(){
    const bulbImg = document.getElementsByTagName("img");
    // console.log(bulbImg);
    bulbImg[0].src="on.webp";
}


// little bit more with style

const list  = document.getElementsByClassName("list");
// console.log(list);
if(list){
    list[0].style.listStyle="none";
    list[0].style.backgroundColor="#000";
    list[0].style.padding="20px";
    list[0].style.boxShadow="10px 10px 15px red,-10px -10px 15px red";
}

const listItems = document.getElementsByTagName("li");
const colors=["violet","brown","grey"];
let len = listItems.length;
for(let li=0;li<len;li++)
{
    if(listItems[li]){
        listItems[li].style.fontSize="30px";
        listItems[li].style.backgroundColor=colors[li];
        listItems[li].style.padding="10px";
        listItems[li].style.color="#fff";
    }
}