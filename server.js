const express = require("express");
const fs = require("fs");
const app = express();
const port = 5500;

app.use(express.json());

// Route để lấy dữ liệu từ tệp JSON
app.get("/getData", (req, res) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error reading data file" });
    } else {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    }
  });
});

// Route để thêm dữ liệu mới vào tệp JSON
app.post("/addData", (req, res) => {
  const newData = {
    name: req.body.name,
    password: req.body.password,
    des: req.body.des,
  };

  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error reading data file" });
    } else {
      let existingData;

      try {
        existingData = JSON.parse(data);
      } catch (parseError) {
        // Xử lý lỗi phân tích cú pháp JSON
        console.error(parseError);
        existingData = [];
      }

      existingData.push(newData);

      fs.writeFile("data.json", JSON.stringify(existingData), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Error writing data file" });
        } else {
          res.json({ message: "Data added successfully" });
        }
      });
    }
  });
});

// Route để cập nhật dữ liệu trong tệp JSON
app.put("/updateData/:id", (req, res) => {
  const idToUpdate = req.params.id;
  const updatedData = {
    name: req.body.name,
    password: req.body.password,
    des: req.body.des,
  };

  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error reading data file" });
    } else {
      const existingData = JSON.parse(data);
      const newDataArray = existingData.map((item) =>
        item.id === idToUpdate ? updatedData : item
      );

      fs.writeFile("data.json", JSON.stringify(newDataArray), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Error writing data file" });
        } else {
          res.json({ message: "Data updated successfully" });
        }
      });
    }
  });
});

// Route để xóa dữ liệu khỏi tệp JSON
app.delete("/deleteData/:id", (req, res) => {
  const idToDelete = req.params.id;

  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error reading data file" });
    } else {
      const existingData = JSON.parse(data);
      const newDataArray = existingData.filter(
        (item) => item.id !== idToDelete
      );

      fs.writeFile("data.json", JSON.stringify(newDataArray), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Error writing data file" });
        } else {
          res.json({ message: "Data deleted successfully" });
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
