// importing modules
const router = require('express').Router();
const db = require('../database/databaseConnection');

//get method to get data for a particuler user
router.get('/viewuser/:id',async(req,res)=>{
    await db.query('select * from user where id=?',[req.params.id]).then((data)=>{
        const user = data[0][0];
        res.render('viewUser',{user});
    })
})

//get method to get all active users
router.get('/',async(req,res)=>{
    let removedUser = req.query.removed;
    await db.query('select * from user where status="active";').then((data)=>{
        const result = data[0];
        res.render('index',{result,removedUser});
    })
})

// post method for search filter
router.post('/',async(req,res)=>{
    try {
        const keywrd = req.body.search;
    await db.query('select * from user where first_name like ? or last_name like ?;',['%' + keywrd + '%','%' + keywrd + '%']).then((data)=>{
        const result = data[0];
        res.render('index',{result});
    }).catch((error)=>{
        res.send(error);
    })
    } catch (error) {
        console.log(error);
    }
})

//route to render create user page
router.get('/adduser',(req,res)=>{
    res.render('createUser');
  
})

// post method to create new user
router.post('/adduser',async(req,res)=>{
    try {
        const {first_name, last_name, email, phone, comments} = req.body;
        await db.query('insert into user(first_name, last_name, email, phone, comments) values(?,?,?,?,?)',[first_name, last_name, email, phone, comments]).then(()=>{
            res.render('createUser',{alert : " user created successfully"});
        }).catch(()=>{
            res.render('createUser',{alert : " user creation failed"});
        })
    } catch (error) {
        console.log(error);
    }
})

// router to render information of a particular user
router.get('/edituser/:id',async(req,res)=>{
    const id = req.params.id;
    await db.query('select * from user where id = ?',[id]).then((data)=>{
        const result = data[0][0];
        res.render('editUser',{result});
    })
})

//router edit information of a particular user
router.post('/edituser/:id',async(req,res)=>{
    const id = req.params.id;
    const {first_name, last_name, email, phone, comments} = req.body;
    await db.query('update user set first_name=?, last_name=?, email=?, phone=?, comments=? where id=?;',[first_name,last_name,email,phone,comments,id]).then((data)=>{
        res.render('editUser',{alert : "edited successfully!!!"});
    })
})

// router to delete a user 
router.get('/deleteuser/:id',async(req,res)=>{
    await db.query('update user set status="inactave" where id = ?',[req.params.id]).then((data)=>{
        res.redirect('/?removed=true');
    })//in this we are setting its status to inactive not deleting it from database
})



//exporting router
module.exports = router;