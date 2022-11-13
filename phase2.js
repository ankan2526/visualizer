const inferface = document.getElementById('user');
const myinput = document.getElementById('myinput');
const generate = document.getElementById('generate');

let maxNodes = 100;
let N;

let edges = [];
for(let i=0;i<=maxNodes;i++){
    edges.push([])
    for(let j=0;j<=maxNodes;j++){
        edges[i].push(0);
    }
}

console.log(generate);

if(generate != null){
generate.addEventListener('click' , () => {
    
    let inp = myinput.value.split(/\r?\n/);
    console.log(inp);

    for(let i = 0;i <= maxNodes;++i)
        for(let j = 0;j <= maxNodes;++j)
        edges[i][j] = 0;
    

    for (let i = 0;i < inp.length;++i){
        let lineinp = inp[i].split(" ");
        console.log(lineinp);
        
        if(i == 0) N = parseInt(lineinp[0]);
        else{
            let u = parseInt(lineinp[0]);
            let v = parseInt(lineinp[1]);
            console.log(u , v);
            edges[u][v] = 1;
            edges[v][u] = 1;
        }
    }
    

    let stringEdges = ""
    for(let i = 0;i <= maxNodes;++i){
        for(let j = 0;j <= maxNodes;++j){
            if(edges[i][j] == 1) stringEdges += "1";
            else stringEdges += "0";
        }
    }
    

    console.log(stringEdges);

    let root = document.getElementById("interface");
    let input = document.getElementById("choice");
    let rootIt = document.getElementById("rootIt");
    let e = stringEdges;
    N = parseInt(N);
    root.innerHTML = "";
    console.log(e);

    let nodes = [] , lines = [] , todrag = null , subx = 0 , suby = 0;
    let isTree = true;

    let vis = [];
    for (let i = 0;i <= N;++i)
    vis.push(false);


    input.max = N;
    input.min = 1;
    maxNodes = 100;
    edges = [];
    for(let i=0;i<=maxNodes;i++){
        edges.push([])
        for(let j=0;j<=maxNodes;j++){
            edges[i].push(0);
        }
    }

    let start = 0;
    for (let i = 0;i <= maxNodes;i++){
        for(let j = 0;j <= maxNodes;++j){
            edges[i][j] = parseInt(e[start]);
            start += 1;
        }
    }



    /*function bfs(root){
        let visited = [];

        for(let i=1;i<=N;i++){
            visited.push(0);
        }
        
        let curLevel = [root];
        visited[root] = 1;
        let levelOrder = [];

        while(curLevel.length > 0){

            levelOrder.push(curLevel);
            let nextLevel = [];
            for(let node of curLevel){
                for(let i=1;i<=N;i++){
                    if(edges[node][i] == 0) continue;
                    if(visited[i] == 1) continue;
                    
                    nextLevel.push(i);
                    visited[i] = 1;

                }
            }
            curLevel = nextLevel;
        }
        return levelOrder;
    }*/






    //tree construction
    let spaceleft = 30 , spacetop = 100;

    let width = {}
    function dfs(p , prev){

        console.log(p , prev);
        
        if(vis[p]) {
            isTree = false;
            return -1;
        }
        vis[p] = true;
        let reqWidth = 0 , isleaf = 1;
        for(let i = 1;i <= N;++i){

            if(i == prev) continue; 
            if(edges[p][i] == 0) continue;

            reqWidth += dfs(i , p) + spaceleft;
            isleaf = 0;
        }

        if(isleaf) {
            width[p] = 50;
            return 50;
        }

        width[p] = reqWidth - spaceleft;
        return reqWidth - spaceleft;

    }

    function check(){
        for (let i = 1;i <= N;++i)
        if(vis[i] == false){
            isTree = false;
        }
    }


    function dfsConstruct(p , prev , leftpoint , toppoint){
        
        let node = document.createElement("div");
        node.className = "node";
        node.id = "node" + p;
        node.innerText = p;
        node.style.left = ((2 * leftpoint + width[p]) / 2) - 25 + "px";
        node.style.top = toppoint + "px"
        node.style.zIndex = "1";
        root.appendChild(node);
        nodes.push(node);

        let lp = leftpoint;
        for(let i = 1;i <= N;++i){
            if(i == prev) continue;
            if(edges[p][i] == 0) continue;
            
            dfsConstruct(i , p , lp , toppoint + spacetop);
            lp += width[i];
            lp += spaceleft;
        }
    }


    function makeEdges(){
        lines = [];
        for(let i = 0;i <= N;++i){
            for (let j = i + 1;j <= N;++j){
                if(edges[i][j] == 0) continue;

                let line = document.createElement("div");
                line.style.position = "absolute";
                line.style.height = 2 + "px";
                line.style.backgroundColor = "black";
                line.id = "line" + i + j;
                    
                let node1 = document.getElementById("node" + i);
                let node2 = document.getElementById("node" + j);
                addEdge(node1 , node2 , line);
                    
                lines.push(line);
                console.log(line);

            }
        }
    }


    dfs(1 , -1);
    check();
    console.log(width);
    console.log(nodes);

    if(isTree == false){
        alert("Invalid Not A Tree");
    }
    else{
        dfsConstruct(1 , -1 , 100 , 100);
        makeEdges();
        move();
    }





    //making edges
    function addEdge(node1 , node2 , line){

        let x1 = parseInt(node1.style.left.slice(0,-2)) + 26;
        let y1 = parseInt(node1.style.top.slice(0,-2)) + 26;
        let x2 = parseInt(node2.style.left.slice(0,-2)) + 25;
        let y2 = parseInt(node2.style.top.slice(0,-2)) + 25;

        let distance = Math.sqrt((x1-x2) * (x1-x2) + (y1-y2) * (y1-y2)) - 50;
        let xMid = (x1+x2)/2;
        let yMid = (y1+y2)/2;
        let angle = (Math.atan2(y1-y2, x1-x2)*180)/Math.PI;

        console.log(distance);
        line.style.width = distance+"px";
        line.style.top = yMid +"px";
        line.style.left = (xMid - (distance / 2)) + "px";
        line.style.transform = "rotate("+angle+"deg)";
        line.style.zIndex = "0";

        root.appendChild(line);

    }


    //making things nodes draggable
    function move(){
        for(let node of nodes){
            
            node.addEventListener('mousedown' , (e) => {
                todrag = node;
                subx = e.pageX - parseInt(node.style.left.slice(0,-2));
                suby = e.pageY - parseInt(node.style.top.slice(0,-2));
            })

        }
    }


    function dragEdge(node){
        
        for(let i = 0;i <= N;++i){

            let u = parseInt(node.innerText);
            let v = i;
            if(edges[u][v] == 0) continue;
            
            let node1 = document.getElementById("node" + u);
            let node2 = document.getElementById("node" + v);

            let minv = (u < v)?u:v;
            let maxv = (u < v)?v:u;
            let line = document.getElementById("line" + minv + maxv);
            addEdge(node1 , node2 , line);

        }

    }


    document.onmouseup = function(e){
        todrag = null;
        subx = 0;
        suby = 0;
    }

    document.onmousemove = function(e){
        const x = e.pageX;
        const y = e.pageY;
        if(todrag){
            dragEdge(todrag);
            todrag.style.left = x - subx + "px";
            todrag.style.top = y - suby + "px";
        }
    }





    rootIt.addEventListener('click' , () => {
        
        //clear all
        for(let node of nodes)
        root.removeChild(node);

        for(let line of lines)
        root.removeChild(line);
        
        isTree = true;
        for(let i = 0;i <= N;++i)
        vis[i] = false;

        let r = input.value;
        r = parseInt(r);

        if(r > N || r < 1){
            console.log(N , r);
            alert("Invalid")
        }
        else{

            //make the tree;
            nodes = [];
            width = {};
            dfs(r , -1);
            check();

            if(isTree) {
                dfsConstruct(r , -1 , 100 , 100);
                makeEdges();
                move();
            }
            else{
                alert("Invalid Not A Tree");
            }
        }

    })

    })
}