const Employee = require("./models/Employee");
const DailyLog = require("./models/DailyLog");

class MiddlewareController {
  changeActice(req, res, next) {
    const {id} = req.query
    Employee.findOne({ id_nv: id })
      .then((nhanvien) => {
            const check = nhanvien.active
            Employee.findByIdAndUpdate({ _id: nhanvien._id }, {active: !check})
            .then(() => {
                next();
            })
            .catch(err => console.log(err));
      })
      .catch((err) => console.log(err));
  }
}

module.exports = new MiddlewareController();
