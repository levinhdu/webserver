const Employee = require("./models/Employee");
const DailyLog = require("./models/DailyLog");
const excel = require('node-excel-export');
const {
  mutipleMongooseToOject,
  mongoosetoOject,
} = require("../../until/mongoose");

class UsersController {
  show(req, res, next) {
    Employee.find({})
      .sort({ id_nv: 1 })
      .then((users) => {
        res.render("users/lisrUsers", {
          users: mutipleMongooseToOject(users),
        });
      })
      .catch(next);
  }

  create(req, res, next) {
    res.render("users/createUser");
  }

  home(req, res, next) {
    const today = new Date();
    const eqDay = {
      $eq: [{ $dayOfMonth: "$createdAt" }, { $dayOfMonth: today }],
    };
    const eqMonth = { $eq: [{ $month: "$createdAt" }, { $month: today }] };

    DailyLog.find({
      $expr: { $and: [eqDay, eqMonth] },
    })
      .then((data) => {
        res.render("home", {
          leght: data.length,
        });
      })
      .catch((err) => console.log(err));
  }

  log(req, res, next) {
    const PAGE_SIZE = 7;
    let page = 1;
    page = req.params.page;
    const soluongboqua = (parseInt(page) - 1) * PAGE_SIZE;
    DailyLog.find({})
      .sort({ createdAt: -1 })
      .populate("employeeId")
      .skip(soluongboqua)
      .limit(PAGE_SIZE)
      .then((users) => {
        res.render("users/userLog", {
          users: mutipleMongooseToOject(users),
          pagination: users.length / 10,
          layout: "userlog",
        });
      })
      .catch((err) => console.log(err));
  }

  employeeFever(req, res, next) {
    const PAGE_SIZE = 10;
    let page = 1;
    page = req.params.page;
    const soluongboqua = (parseInt(page) - 1) * PAGE_SIZE;
    DailyLog.find({
      $expr: {
        $or: [{ $gte: ["$tempin", 37.5] }, { $gte: ["$tempout", 37.5] }],
      },
    })
      .sort({ createdAt: -1 })
      .populate("employeeId")
      .skip(soluongboqua)
      .limit(PAGE_SIZE)
      .then((users) => {
        res.render("users/employeeFever", {
          users: mutipleMongooseToOject(users),
        });
      })
      .catch((err) => console.log(err));
  }

  thongke(req, res, next) {
    const {fDate, tDate} = req.body
    if(fDate && tDate){
      const fromDate = new Date(req.body.fDate);
    const tmpToDate = new Date(req.body.tDate);
    const toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));
    const compareFromDate = { $gte: ["$createdAt", fromDate] };
    const compareToDate = { $lt: ["$createdAt", toDate] };
    var danhsach = [];
    DailyLog.find(
      {
        $expr: {
          $and: [
            { $gte: [{ $hour: "$createdAt" }, 0] },
            { $lte: [{ $hour: "$createdAt" }, 4] },
            { $gte: [{ $second: "$createdAt" }, 1] },
            compareToDate,
            compareFromDate,
          ],
        },
      },
      { employeeId: 1, createdAt: 1, updatedAt: 1 }
    )
      .sort({ createdAt: -1 })
      .populate({ path: "employeeId", select: "id_nv name position" })
      .then((users) => {
        const list = users.map((user) => {
          return user.employeeId;
        });
        function count_element_in_array(array, x) {
          let count = 0;
          for (let i = 0; i < array.length; i++) {
            if (array[i] == x)
              //Tìm thấy phần tử giống x trong mảng thì cộng biến đếm
              count++;
          }
          const y = { employeeId: x, count: count };
          return danhsach.push(y);
          console.log("Phan tu " + x + " xuat hien " + count + " lan");
        }
        /*Xóa phần tử trùng nhau và lấy các phần tử duy nhất*/
        let arrayWithNoDuplicates = list.reduce(function (
          accumulator,
          element
        ) {
          if (accumulator.indexOf(element) === -1) {
            accumulator.push(element);
          }
          return accumulator;
        },
        []);
        /*đếm số lần xuất hiện của các phần tử duy nhất*/
        for (let i = 0; i < arrayWithNoDuplicates.length; i++)
          count_element_in_array(list, arrayWithNoDuplicates[i]);
      })
      .then(() => {
        const styles = {
          headerDark: {
            fill: {
              fgColor: {
                rgb: "FFFFFFFF",
              },
            },
            font: {
              color: {
                rgb: "000000",
              },
              sz: 12,
              bold: true,
            },
          },
          header: {
            fill: {
              fgColor: {
                rgb: "FFFFFFFF",
              },
            },
            font: {
              color: {
                rgb: "000000",
              },
              sz: 16,
              bold: true,
            },
          },
          cellPink: {
            fill: {
              fgColor: {
                rgb: "FFFFFFFF",
              },
            },
          },
          cellGreen: {
            fill: {
              fgColor: {
                rgb: "FFFFFFFF",
              },
            },
          },
        };

        const heading = [
          [{value: `Thống kê nhân viên đi trễ từ ${fDate} đến ${tDate}`, style: styles.header}],
          [''] // <-- It can be only values
        ];

        const specification = {
          name: {
            displayName: "Họ và tên", // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 150, // <- width in pixels
          },
          id_nv: {
            displayName: "Mã nhân viên",
            headerStyle: styles.headerDark,
            width: "15", // <- width in chars (when the number is passed as string)
          },
          position: {
            displayName: "Chức vụ",
            headerStyle: styles.headerDark,
            width: 100, // <- width in pixels
          },
          late: {
            displayName: "Số lần đi trễ",
            headerStyle: styles.headerDark,
            width: 120, // <- width in pixels
          },
        };

        const dataset = danhsach.map((d) => {
          return {
            name: d.employeeId.name,
            id_nv: d.employeeId.id_nv,
            position: d.employeeId.position,
            late: d.count,
          };
        });

        const report = excel.buildExport([
          // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
          {
            name: "Report", // <- Specify sheet name (optional)
            heading: heading, // <- Raw heading array (optional)
            specification: specification, // <- Report specification
            data: dataset, // <-- Report data
          },
        ]);
        res.attachment("report.xlsx");
        return res.send(report);
      })
      .catch((err) => console.log(err));
    }
    else{
      res.redirect('back')
    }
  }

  employeeLate(req, res, next) {
    const PAGE_SIZE = 7;
    let page = 1;
    page = req.params.page;
    const soluongboqua = (parseInt(page) - 1) * PAGE_SIZE;
    DailyLog.find({
      $expr: {
        $and: [
          { $gte: [{ $hour: "$createdAt" }, 0] },
          { $lte: [{ $hour: "$createdAt" }, 4] },
          { $gte: [{ $second: "$createdAt" }, 1] },
        ],
      },
    })
      .sort({ createdAt: -1 })
      .populate("employeeId")
      .skip(soluongboqua)
      .limit(PAGE_SIZE)
      .exec((err, users) => {
        res.render("users/employeeLate", {
          users: mutipleMongooseToOject(users),
          late: 5,
        });
      });
  }

  getDataIn(req, res, next) {
    const fromData = req.query;
    const date = new Date();
    const hours =
      date.getHours().toString().length === 1
        ? "0" + date.getHours()
        : date.getHours();
    const minutes =
      date.getMinutes().toString().length === 1
        ? "0" + date.getMinutes()
        : date.getMinutes();
    const seconds =
      date.getSeconds().toString().length === 1
        ? "0" + date.getSeconds()
        : date.getSeconds();

    Employee.findOne({ id_nv: req.query.id })
      .then((nhanvien) => {
        fromData.employeeId = nhanvien._id;
        if (nhanvien.active === false) {
          fromData.tempin = fromData.temp;
          const newDailyLog = new DailyLog(fromData);
          newDailyLog.save();
          res.send("200");
        } else if (nhanvien.active === true) {
          next();
        }
      })
      .catch((err) => console.log(err));
  }

  getDataOut(req, res, next) {
    const { id, temp } = req.query;
    const fromData = {
      tempout: temp,
      in: false,
    };
    Employee.findOne({ id_nv: id })
      .then((employee) => {
        DailyLog.findOneAndUpdate(
          { employeeId: employee._id, in: true },
          fromData
        )
          .then(() => res.send("200"))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  getName(req, res, next) {
    const { id } = req.query;
    Employee.findOne({ id_nv: id })
      .then((employee) => {
        const name = employee.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toUpperCase();
        res.send(name);
      })
      .catch((err) => console.log(err));
  }

  store(req, res, next) {
    const newEmployee = new Employee(req.body);
    newEmployee
      .save()
      .then(() => res.redirect("/employee"))
      .catch(next);
  }

  edit(req, res, next) {
    Employee.findById(req.params.id).then((users) => {
      res.render("users/editUser", {
        users: mongoosetoOject(users),
      });
    });
  }

  update(req, res, next) {
    Employee.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/employee"))
      .catch(next);
  }

  delete(req, res, next) {
    Employee.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }
}

module.exports = new UsersController();
