import { Router } from 'express'

const router = Router()

router.post('/user/login', require('./userLogin'))
router.post('/user/logout', require('./userLogout'))
router.get('/user/info', require('./user'))
router.post('/user/sms', require('./mobile'))
router.post('/user/register', require('./register'))
router.post('/todo/save', require('./todoAdd'))
router.get('/todo/info', require('./todoInfo'))
// router.post('/upload', require('./upload'))
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