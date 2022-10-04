#!/usr/bin/env node
const fs = require('fs')
var argvs = process.argv.slice(2,)
var lastId = readTasks().tasks.reverse()[0].id

var header = {
    id: 0,
    description: '',
    age: '',
    priority:'',
    status:'',
}

if(searcheComand('add') && argvs.length > 0){
    addTask(argvs)
}

if(searcheComand('list') && argvs.length > 0){
    printTasks(argvs)
}

function addTask(commands){
    for (let index = 0; index < commands.length; index++) {
        if(commands[index]=='-d' && !searcheComand(commands[index+1])){
            header.description =  commands[index+1]
        }

        if(commands[index]=='-p' && !searcheComand(commands[index+1])){
            header.priority =  commands[index+1]
        }

        if(commands[index]=='-s' && !searcheComand(commands[index+1])){
            header.status =  commands[index+1]
        }
    }
    header.id = lastId + 1;
    header.age = new Date().toLocaleDateString()
    save(header)
}

function printTasks(commands){
    let index = 1;

    if(commands[index]=='list' && commands[index+1] == '-a'){
        listAllTasks()
    }

    if(commands[index+1]=='-i'){
        listTaskById(parseInt(commands[index+2]))
    }
}

function save(task){
    var tasks = readTasks();
    tasks.tasks.push(task);
    fs.writeFileSync(__dirname+'/task.json',JSON.stringify(tasks),{encoding:'utf-8'})
}

 function readTasks(id){
    var data = fs.readFileSync(__dirname+'/task.json',{encoding:'utf-8'})
    var tasks = JSON.parse(data)
    if(id != undefined && !isNaN(id)){
        return tasks.tasks.find(task => task.id == id)
    }else{
        return tasks
    }
}

function searcheComand(comand){
    var find = argvs.find(cmd => cmd == comand)
    if(find) return true;
    return false;
}

function isDone({status}){
    if(status) return true;
    return false;
}

function sortByPriority(tasks){
    for(let i=0;i < tasks.length;i++){
        for(let j = 1;j<tasks.length;j++){
            if(tasks[j-1].priority != 'high'){
                var tmp = tasks[j-1] 
                tasks[j-1] = tasks[i]
                tasks[i] = tmp
            }
        }
    }
    return tasks
}

function listAllTasks(){
    console.table(sortByPriority(readTasks().tasks))
}

function listTaskById(id){
    let task = []
    task.push(readTasks(id))
    console.table(task)
}


