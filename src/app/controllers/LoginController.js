const {Admin} = require('./models/User');
const {mutipleMongooseToOject,mongoosetoOject} = require('../../until/mongoose');




class LoginController{

    view(req,res,next){
        res.render('admin/login',{
            layout: 'LoginAdmin'
        })
    }

    login(req,res,next){
        Admin.findOne({
            admin: req.body.admin,
            password: req.body.password
        })
            .then(admin => {
                if(admin){
                    res.redirect('/users')
                } else{
                    res.redirect('back')
                }
            })
            .catch(next)
    }

    edit(req,res,next){
        Admin.find()
            .then(admin => {
                res.render('admin/edit',{
                    admin: mutipleMongooseToOject(admin)
                })             
            })      
    }

    //[PUT] /courses/:id
    update(req, res, next) {
        Admin.updateOne({_id: req.params.id}, req.body)
        .then(() => res.redirect('/users'))
        .catch(next)
    }
}

module.exports = new LoginController();