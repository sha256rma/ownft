import express from 'express';
import fileUpload from 'express-fileupload';
import ipfsClient from 'ipfs-http-client';

const ipfs = ipfsClient(); 

const app = express();

app.use(fileUpload({
    createParentPath: true
}));

app.post('/add', async (req, res) => {
    try {
        if (!req.files) {
            res.status(500).send({
                message: 'no file uploaded'
            })
        } else {
            let nftfile = req.files.nftfile;
            const { cid } = await ipfs.add(nftfile.data);
            res.send({
                message: `Successfully added file to ipfs`,
                cidv1: cid.toV1().toString(),
                cidv0: cid.toV0().toString()
            })
        }
    } catch (e) {
        res.status(500).send({
            error: e
        })
    }
})

app.post('/pin/:cid', async (req, res) => {
    try {
        await ipfs.pin.add(new CID(req.params.cid));
        res.send({ 'success': true });
    } catch(e) {
        res.status(500).send({ 'error': e });
    }
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App is listening on port ${port}.`)
})