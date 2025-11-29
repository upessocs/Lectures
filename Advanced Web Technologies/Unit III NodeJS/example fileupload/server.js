const express = require('express');
const bodyParser = require('body-parser');
const uploadRoutes = require('./routes/uploadRoutes');
const listRoutes = require('./routes/listRoutes');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/upload', uploadRoutes);
app.use('/list', listRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
  // try {
  // // startTunnel();  
  // } catch (error) {
  //   console.log(error)
  // }
  
});

// LocalTunnel function
async function startTunnel() {
  const localtunnel = require('localtunnel');

  const tunnel = await localtunnel({
    port: PORT,
    // you can set a fixed subdomain if needed:
    // subdomain: "mytestupload"  
  });

  console.log('Public URL:', tunnel.url);

  tunnel.on('close', () => {
    console.log('LocalTunnel closed');
  });
}
