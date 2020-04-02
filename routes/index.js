import { Router } from 'express'

const router = Router()

router.post('/user/login', require('./userLogin'))
router.get('/user/:id', require('./user'))
router.post('/user/sms', require('./mobile'))
// router.post('/upload', require('./upload'))
// router.get('/category', require('./category'))
// router.post('/category/add', require('./categoryAdd'))
// router.get('/album', require('./album'))
// router.get('/album/:key', require('./albumKey'))
// router.post('/album/add', require('./albumAdd'))
// router.put('/album/edit', require('./albumEdit'))
// router.delete('/album/delete', require('./albumDelete'))
// router.get('/album/photo/:album', require('./photo'))
// router.post('/photo/save', require('./photoAdd'))
// router.post('/photo/add/batch', require('./photoAddBatch'))
// router.put('/photo/update', require('./photoUpdate'))
// router.delete('/photo/delete', require('./photoDelete'))

module.exports = router