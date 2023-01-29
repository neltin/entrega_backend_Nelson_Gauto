const {Router} = require('express');
const router = Router();

//HandleBars Router Real Time Products
router.get('/', (req, res )=>{

    const data =  {
        title: "Chat",
        style: "/styles/chat.style.css",
        chat: true
    }


    res.render('chat', data);
})

module.exports = router;