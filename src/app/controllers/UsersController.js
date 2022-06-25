const {User} = require('./models/User');
const { mutipleMongooseToOject, mongoosetoOject} = require('../../until/mongoose');



class UsersController{

    show(req,res,next){
        User.find({})
            .then(users => {
                res.render('users/lisrUsers',{
                    users : mutipleMongooseToOject(users)
                })
            })
            .catch(next)
    }

    create(req,res,next){
        res.render('users/createUser')
    }

    get(req,res,next){
        console.log(req.query)
        User.updateOne({mssv: req.query.mssv}, req.query)
            .then(() => res.redirect(''))
            .catch(next)
    }

    log(req,res,next){
        User.find({condition: true}).sort({Date: -1})
            .then(users => {
                res.render('users/userLog',{
                    users: mutipleMongooseToOject(users),
                    layout: 'userlog'
                })
            })
            .catch(next)
    }
    getData(req,res,next){
        const fromData = req.query
        const date = new Date()
        const hours = date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours();
        const minutes = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes();
        const seconds = date.getSeconds().toString().length === 1 ? '0' + date.getSeconds() : date.getSeconds();
        fromData.Date = date
        fromData.date =  date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear()
        fromData.timein = hours + ':' + minutes + ':' + seconds
        fromData.condition = true
        console.log(fromData)
        User.updateOne({mssv: req.query.mssv}, fromData)
            .then(() => res.send("200"))
            .catch(next)
    }

    store(req,res,next){
        const user = new User(req.body);
        user.save()
            .then(() => res.redirect('/users'))
            .catch(next)
    }

    edit(req,res,next){
        User.findById(req.params.id)
            .then(users => {
                    res.render('users/editUser',{
                        users : mongoosetoOject(users)
                    })
            }
        )
    }

    update(req, res, next) {
        User.updateOne({_id: req.params.id}, req.body)
          .then(() => res.redirect('/users'))
          .catch(next)
      }

    delete(req, res, next) {
        User.deleteOne({_id: req.params.id})
          .then(() => res.redirect('back'))
          .catch(next)
    }
}

module.exports = new UsersController();