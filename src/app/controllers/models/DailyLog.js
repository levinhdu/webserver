const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DailyLog = new Schema(
  {
    tempin: { type: String, maxlength: 255 },
    tempout: { type: String, maxlength: 255 },
    in: { type: Boolean, default: true },
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee" },
  },
  {
    timestamps: true,
    collection: "dailyLog",
  }
);

// Virtuals
DailyLog.virtual("timein").get(function () {
  const date = this.createdAt;
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
  return hours + ":" + minutes + ":" + seconds;
});

DailyLog.virtual("timeout").get(function () {
  const date = this.updatedAt;
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
  return hours + ":" + minutes + ":" + seconds;
});

DailyLog.virtual("date").get(function () {
  const date = this.createdAt;
  return (
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
});

// Virtuals in console.log()
DailyLog.set("toObject", { virtuals: true });
// Virtuals in JSON
DailyLog.set("toJSON", { virtuals: true });

module.exports = mongoose.model("DailyLog", DailyLog);
