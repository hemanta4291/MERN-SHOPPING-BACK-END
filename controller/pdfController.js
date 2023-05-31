
const pdf = require('html-pdf')
const pdfTemplate = require('../utils/documents')

const geteratePdf = async (req,res) => {

    // console.log(req.body)
    pdf.create(pdfTemplate(req.body), { childProcessOptions: {
        env: {
          OPENSSL_CONF: '/dev/null',
        },
      }}).toFile(`${__dirname}/result.pdf`, (err) => {
        // console.log(err)
        if(err) {
            // res.setHeader('X-Foo', 'bar')
            res.status(401).json({
                message:'pdf not crate',
                status:'not crate'
            })
        }

        res.status(200).json({
            message:'pdf create successfully done',
            status:'Ok'
        })
    });
}

const getPdf = async (req,res) => {

    console.log(req.dirname)

    res.sendFile(`${__dirname}/result.pdf`)
}



module.exports = {
    geteratePdf,getPdf
}