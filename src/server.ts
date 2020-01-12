import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

var validUrl = require('valid-url');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}");
  } );

  // Filter Image Endpoint
  // Takes an image URL as a parameter, gets the image, filters it, and then sends it back
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  app.get( "/filteredimage", async ( req, res, next ) => {
    try {
      
      let imgUrl = req.query.image_url;                                 // Get image URL

      if (imgUrl == undefined || imgUrl == null                         // Validate iamge URL
        || !validUrl.isUri(imgUrl)){
        res.send(`${imgUrl} is not a valid URL...`) 
      } 
      
      let filteredImg = await filterImageFromURL(imgUrl);               // Filter image

      res.sendFile(filteredImg, async (err) => {                        // Send image back
        await deleteLocalFiles([filteredImg]);                          // Delete local file
        if (err) {
          console.log(`Failed to send file back:\n${err}`);
          res.send(`Failed to filter image`);
        }
      });
    } 
    catch(ex) {
      console.log(`Failed to filter image:\n${ex}`);
     	res.send(`Failed to filter image`);
    }
  });  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();