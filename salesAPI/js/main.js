
let saleData = []; // load data
let page = 1; //current page
let perPage = 10; //Total number of pages

const saleTableTemplate = _.template(`
    <% saleData.forEach(function(sale){ %>
    <tr data-id='<%- sale._id %>'>
        <td><%- sale.customer.email %></td>
        <td><%- sale.storeLocation %></td>
        <td><%- sale.items.length %></td>
        <td><%- moment(sale.saleDate).format('LLLL') %></td>
    </tr>
    <% }); %>
`);

const saleModelBodyTemplate = _.template(`
    <h4>Customer</h4>
    <strong>email: </strong> <%- sale.customer.email %></br>  <td><%- sale.customer.email %></td>
    <strong>age: </strong> <%- sale.customer.age %></br>
    <strong>satisfaction: </strong> <%- sale.customer.satisfaction %>/5
    </br></br>

    <h4>totalPrice: $<%- totalPrice %></h4> 
    <table class="table">
        <thead>
            <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
        </thead>

        <tbody>
        <% sale.items.forEach(function(item){ %>
            <tr>
                <td><%- item.name %></td>
                <td><%- item.quantity %></td>
                <td><%- item.price %></td>
            </tr>
        <% }); %>
        </tbody>
    </table>    
`);


function loadSaleData(){
    fetch(`http://127.0.0.1:8080/api/sales?page=${page}&perPage=${perPage}`)
    .then(response => response.json())
    .then(json => {
        saleData = json;
        refreshSalesRows(saleData); 
    });

}


function refreshSalesRows(saleData){

    $("#sale-table tbody").empty();
    let mainTable = saleTableTemplate({ saleData: saleData });
    $("#sale-table tbody").html(mainTable);
    
}

function getSaleById(id){
    let found = _.find(saleData, function(sale){
        return sale._id == id;
    });
    return found;
}

function createSaleModal(){
    $("#sale-table tbody").on("click","tr",function(){
       
        let clickedId = $(this).attr("data-id");
        let clickedSale = getSaleById(clickedId);
        
        let total = 0;
        clickedSale.items.forEach(function(item){
        total += item.price * item.quantity
        });

        let modalTable = saleModelBodyTemplate({ sale: clickedSale, totalPrice: total  });
        $("#myModal .modal-body").html(modalTable);
        $("#myModal").modal();
         
    });

}
function setCurrentPage(){
    $("#current").html(`<a>${page}</a>`);

}
function nextPage(){
   
    $("#next").on("click", "a", function(){
        console.log("called next");
        if(page < perPage){
            page++;
            console.log("page: " + page);
        }
        loadSaleData();
        setCurrentPage();
    })
}

function previousPage(){
    $("#previous").on("click", "a", function(){
        if(page > 1){
            page--;
        }
        loadSaleData();
        setCurrentPage();
    })
}
$(function(){
    loadSaleData();
    createSaleModal();
    setCurrentPage();
    previousPage();
    nextPage();

});