//cliente
const socket = io(); //Conectar al servidor Socket => (connection)

const form_product = document.getElementById("form_product");
const msj = document.getElementById("msj");

socket.on("getProducts", (data)=>{
    let table_body = document.getElementById("table_body");
    
    table_body.innerHTML = "";

    data.forEach((p)=>{
        const tr = document.createElement("tr");
        let td = `<tr>
            <td>${p.code}</td>
            <td>${p.title}</td>
            <td>${p.description}</td>
            <td>${p.category}</td>
            <td>$${p.price}</td>
            <td>${p.stock}</td>
            <td>${p.status ? "Habilitado": "Inhabilitado"}</td>
            <td><a href="#" class="eliminar" data-id="${p.id}">Eliminar</a></td>`;

            tr.innerHTML += td;
            
            const btnDelete = tr.querySelectorAll(".eliminar");
                   
            btnDelete.forEach((btn)=>{   
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    socket.emit("deleteProducts", btn.dataset.id);
                })
            });

        table_body.append(tr);

    })
});

form_product.addEventListener("submit", (e)=>{
    e.preventDefault();
    
    const data = {};

    form_product.querySelectorAll("input").forEach((input)=>{
        if(input.name){
            data[input.name] = {};
            data[input.name] = input.value;
        }
    });

   socket.emit("addProducts", data);
})

socket.on("msj", (data)=>{
    msj.innerHTML = data;
    msj.setAttribute("class", "active");
    setTimeout(() => {
        msj.innerHTML = "";
        msj.removeAttribute("class")
 }, 4000)
})


