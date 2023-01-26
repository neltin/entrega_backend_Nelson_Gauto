const {Router} = require('express');
const router = Router();

//HandleBars Router Real Time Products
router.get('/', (req, res )=>{
    const data =  {
        title: "Real Time Products",
    }
    res.render('realTimeProducts', data);
})


module.exports = router;