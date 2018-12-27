---
layout: article
title: 客户端(浏览器端)数据存储技术概览
key: 2017-04-13
tags: notes
categories: notes
created_date: 2017-04-13 10:59
date: 2018-02-04 19:09:22
---

在客户端(浏览器端)存储数据有诸多益处，最主要的一点是能快速访问(网页)数据。(以往)在客户端有五种数据存储方法，而目前就只有四种常用方法了(其中一种被废弃了)：

- Cookies
- LocalStorage
- SessionStorage
- IndexedDB
- WebSQL (被废弃)

<!--more-->

原文地址： https://github.com/dwqs/blog/issues/42

## Cookies

Cookies 是一种在文档内存储字符串数据最典型的方式。一般而言，cookies 会由服务端发送给客户端，客户端存储下来，然后在随后让请求中再发回给服务端。这可以用于诸如管理用户会话，追踪用户信息等事情。

此外，客户端也用使用 cookies 存储数据。因而，cookies 常被用于存储一些通用的数据，如用户的首选项设置。
Cookies 的 基本CRUD 操作

通过下面的语法，我们可以创建，读取，更新和删除 cookies:

```javascript
// Create
document.cookie = "user_name=Ire Aderinokun";  
document.cookie = "user_age=25;max-age=31536000;secure";

// Read (All)
console.log( document.cookie );

// Update
document.cookie = "user_age=24;max-age=31536000;secure"; 

// Delete
document.cookie = "user_name=Ire Aderinokun;expires=Thu, 01 Jan 1970 00:00:01 GMT";  
```

### Cookies 的优点

    能用于和服务端通信
    当 cookie 快要自动过期时，我们可以重新设置而不是删除

### Cookies 的缺点

    增加了文档传输的负载
    只能存储少量的数据
    只能存储字符串
    潜在的 安全问题
    自从有 Web Storage API (Local and Session Storage)，cookies 就不再被推荐用于存储数据了

### 浏览器支持

所有主流浏览器均支持 Cookies.

## localStorage

Local Storage 是 Web Storage API 的一种类型，能在浏览器端存储键值对数据。Local Storage 因提供了更直观和安全的API来存储简单的数据，被视为替代 Cookies 的一种解决方案。

从技术上说，尽管 Local Storage 只能存储字符串，但是它也是可以存储字符串化的JSON数据。这就意味着，Local Storage 能比 Cookies 存储更复杂的数据。
Local Storage 的 基本CRUD 操作

通过下面的语法，我们可以创建，读取，更新和删除 localStorage:

```javascript
// Create
const user = { name: 'Ire Aderinokun', age: 25 }  
localStorage.setItem('user', JSON.stringify(user));

// Read (Single)
console.log( JSON.parse(localStorage.getItem('user')) ) 

// Update
const updatedUser = { name: 'Ire Aderinokun', age: 24 }  
localStorage.setItem('user', JSON.stringify(updatedUser));

// Delete
localStorage.removeItem('user');  
```

### localStorage 的优点

相比于Cookies：

    其提供了更直观地接口来存储数据
    更安全
    能存储更多数据

### localStorage 的缺点

只能存储字符串数据(直接存储复合数据类型如数组/对象等，都会转化成字符串，会存在存取数据不一致的情况

```javascript
localStorage.setItem('test',1);
console.log(typeof localStorage.getItem('test'))  //"string"

localStorage.setItem('test2',[1,2,3]);
console.log(typeof localStorage.getItem('test2'))  //"string"
console.log(localStorage.getItem('test2'))  //"1,2,3"

localStorage.setItem('test3',{a:1,b:2});
console.log(typeof localStorage.getItem('test3'))  //"string"
console.log(localStorage.getItem('test3'))  //"[object object]"

//为避免存取数据不一致的情形，存储复合数据类型时进行序列化，读取时进行反序列化
localStorage.setItem('test4', JSON.stringify({a:1,b:2}));
console.log(typeof localStorage.getItem('test4'))  //"string"
console.log(JSON.parse(localStorage.getItem('test4')))  //{a:1,b:2}
```

### 浏览器支持

IE8+/Edge/Firefox 2+/Chrome/Safari 4+/Opera 11.5+(caniuse)

## sessionStorage

sessionStorage 是 Web Storage API 的另一种类型。和 localStorage 非常类似，区别是 sessionStorage 只存储当前会话页(tab页)的数据，一旦用户关闭当前页或者浏览器，数据就自动被清除掉了。
Session Storage 的 基本CRUD 操作

通过下面的语法，我们可以创建，读取，更新和删除 sessionStorage:

```javascript
// Create
const user = { name: 'Ire Aderinokun', age: 25 }  
sessionStorage.setItem('user', JSON.stringify(user));

// Read (Single)
console.log( JSON.parse(sessionStorage.getItem('user')) ) 

// Update
const updatedUser = { name: 'Ire Aderinokun', age: 24 }  
sessionStorage.setItem('user', JSON.stringify(updatedUser));

// Delete
sessionStorage.removeItem('user');  
```

### 优点，缺点和浏览器支持

和 localStorage 一样

## IndexedDB

IndexedDB 是一种更复杂和全面地客户端数据存储方案，它是基于 JavaScript、面向对象的和数据库的，能非常容易地存储数据和检索已经建立关键字索引的数据。

在构建渐进式Web应用一文中，我已经介绍了怎么使用 IndexedDB 来创建一个离线优先的应用。
IndexedDB 的基本 CRUD 操作

    注：在示例中，我使用了 Jake's Archibald 的 IndexedDB Promised library, 它提供了 Promise 风格的IndexedDB方法

使用 IndexedDB 在浏览器端存储数据比上述其它方法更复杂。在我们能创建/读取/更新/删除任何数据之前，首先需要先打开数据库，创建我们需要的stores(类似于在数据库中创建一个表)。

```javascript
function OpenIDB() {  
    return idb.open('SampleDB', 1, function(upgradeDb) {
        const users = upgradeDb.createObjectStore('users', {
            keyPath: 'name'
        });
    });
}
```

创建或者更新store中的数据：

```javascript
// 1. Open up the database
OpenIDB().then((db) => {  
    const dbStore = 'users';

    // 2. Open a new read/write transaction with the store within the database
    const transaction = db.transaction(dbStore, 'readwrite');
    const store = transaction.objectStore(dbStore);

    // 3. Add the data to the store
    store.put({
        name: 'Ire Aderinokun',
        age: 25
    });

    // 4. Complete the transaction
    return transaction.complete;
});
```

检索数据：

```javascript
// 1. Open up the database
OpenIDB().then((db) => {  
    const dbStore = 'users';

    // 2. Open a new read-only transaction with the store within the database
    const transaction = db.transaction(dbStore);
    const store = transaction.objectStore(dbStore);

    // 3. Return the data
    return store.get('Ire Aderinokun');
}).then((item) => {
    console.log(item);
})
```

删除数据：

```javascript
// 1. Open up the database
OpenIDB().then((db) => {  
    const dbStore = 'users';

    // 2. Open a new read/write transaction with the store within the database
    const transaction = db.transaction(dbStore, 'readwrite');
    const store = transaction.objectStore(dbStore);

    // 3. Delete the data corresponding to the passed key
    store.delete('Ire Aderinokun');

    // 4. Complete the transaction
    return transaction.complete;
})
```

如果你有兴趣了解更多关于IndexedDB的使用，可以阅读我的这篇关于怎么在渐进式Web应用(PWA)使用IndexedD。

### IndexedDB 的优点

    能够处理更复杂和结构化的数据
    每个'database'中可以有多个'databases'和'tables'
    更大的存储空间
    对其有更多的交互控制

### IndexedDB 的缺点

    比 Web Storage API 更难于应用

## 几种技术的浏览器支持

IE10+/Edge12+/Firefox 4+/Chrome 11+/Safari 7.1+/Opera 15+(caniuse)对比

| Feature          | Cookies | Local Storage | Session Storage | IndexedDB                |
| ---------------- | ------- | ------------- | --------------- | ------------------------ |
| Storage Limit    | ~4KB    | ~5MB          | ~5MB            | Up to half of hard drive |
| Persistent Data? | Yes     | Yes           | No              | Yes                      |
| Data Value       | Type    | String        | String          | String                   |
| Indexable ?      | No      | No            | No              | Yes                      |

## 参考

[An Overview of Client-Side Storage](https://bitsofco.de/an-overview-of-client-side-storage/)
