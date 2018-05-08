module.exports= {
    params :{
    'userName': "sa" ,
    'password': "12345678",
    'server': "localhost", //--------------------{  Production Server }
    'options': {
    'requestTimeout': 30 * 1000,
    //instanceName: '\SQLEXPRESS',
    'port': 1400,
    //instanceName: '\SQLEXPRESS', // Name of SQL Instance
    'rowCollectionOnRequestCompletion': true,
    //database: 'C:\\GRUPOCF2017\\MyBusinessPOS2011.mdf',

    'database': 'C:\\GRUPOCF2017\\MyBusinessPOS2011.mdf',
    'encrypt': false,
    'debug': {
        'data': true, // lots of info generated in console when true
        'payload': false,
        'token': false,
        'packet': true, // was on true
        'log': true
        }
    }
    }
}
