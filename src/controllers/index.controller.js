const indexCtrl = {};

indexCtrl.renderIndex = (req, res) => {
  res.render('index.hbs');
};

indexCtrl.renderAbout = (req, res) => {
  res.render('about.hbs');
};

module.exports = indexCtrl;