const tBody = document.getElementById('myTable');
const search = document.getElementById('search');
const tableHead = document.querySelectorAll('th');

const buttonsCollection = document.querySelectorAll('button');
var arr = [{}];
var state;
var tableData=[];

$.ajax({
    method:'GET',
    url:'./movies.json',
    success:function(res){
        arr=res.map((item)=>{
           return{
            "title" : item.title,
            "imdb" : item.imdb.rating,
            "tomatoes" :item.tomatoes.viewer.rating,
            "view" : item.plot
           } 
           
        })
        
        
        state ={
            'querySet':arr,
            'page':10,
            'row':5,
            'window':5
        }
        
        
        
        setTable(arr);
    }
    
})





function pagination(querySet,page,row){
    
    let trimStart = (page-1)*row;

    let trimLast = trimStart+row;
    console.log(querySet);
    var trimmeData = querySet.slice(trimStart,trimLast);
    console.log(trimmeData,"trimdata");
    var pages = Math.ceil(querySet.length/row);
    return {
        'querySet':trimmeData,
        'page':pages
    }
}

search.addEventListener('keyup',(e)=>{
    let searchValue = event.target.value;
    // console.log(state.querySet);
    let data= searchTable(state.querySet,searchValue);
    
    setTable(data);
})




tableHead.forEach(th=>{
    th.addEventListener('click',()=>{
        const column = event.target.dataset.column;
        
        const order = event.target.dataset.order;
        
        let text = th.textContent.substring(0,th.textContent.length-1);
        
        if(order=='desc'){
            event.target.dataset.order = 'asc';
            
            arr = arr.sort((arr1,arr2)=>arr1[column]>arr2[column]? -1:1);
            
            text+='&#9660';
        }
        else{
            event.target.dataset.order = 'desc';
            arr = arr.sort((arr1,arr2)=>arr1[column]<arr2[column]? -1:1);
            text+='&#9650';
           }
           th.innerHTML=text;
           setTable(arr)
    })
})

// JavaScript code


function buttonNavigation(pages) {

const pagination_wrapper = document.getElementById('pagination-wraper');
pagination_wrapper.innerHTML = '';
    
   
   
    let maxLeft = (state.page - Math.floor(state.window/2));
    let maxRight = (state.page + Math.floor(state.window/2));
    if(maxLeft<1){
        maxLeft=1;
        maxRight=state.window;
    }
    if(maxRight>pages){
        maxLeft = pages - (state.window-1);
        maxRight = pages;
        if(maxLeft<1){
            maxLeft=1;

        }
    }

    for (let index = maxLeft; index <= maxRight; index++) {
        pagination_wrapper.innerHTML += `<button class="page btn btn-sm btn-info" onclick=navigate(${index})>${index}</button>`;
    }
    if(state.page!=1){
        pagination_wrapper.innerHTML = `<button value=${state} class="page btn btn-sm btn-info">&#187; First </button>`+pagination_wrapper.innerHTML;
    }
   if(state.page!=pages){
    pagination_wrapper.innerHTML+=`<button value=${pages} class="page btn btn-sm btn-info">Last &#187;</button>`
   }
}





function navigate(index) {
    state.page = index;
    
    setTable(state.querySet)
    
}





function searchTable(arr,searchValue){
    
    const searchedTable = [];
    for(let i=0;i<arr.length;i++){
       if(arr[i].title.toLowerCase().includes(searchValue.toLowerCase())){
            searchedTable.push(arr[i]);
            
       }
    
    
    }
    
    return searchedTable;
}



function setTable(arr){
  
    console.log(arr,"setTable");
    let pageData = pagination(arr,state.page,state.row);

    
    let tableRow = pageData.querySet;
    

    tBody.innerHTML = '';
    for(let index = 0;index<tableRow.length;index++){
        let total = ((tableRow[index].imdb + tableRow[index].tomatoes*2)/2).toFixed(1);
        
        tableRow[index].total = total;
        let row = `<tr>
        
        <td>${tableRow[index].title}</td>
        <td>${tableRow[index].imdb}</td>
        <td>${tableRow[index].tomatoes}</td>
        <td>${total}</td>
        <td>${tableRow[index].view}</td>
    </tr>`
    tBody.innerHTML+=row;
    
    }
   
    buttonNavigation(pageData.page,pageData)
   
    
    
    
}
