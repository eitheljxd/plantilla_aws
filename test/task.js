let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../src/index");

//Assertion Style
chai.should();

chai.use(chaiHttp);
describe('Tasks API', () => {

     /**
     * Test de la función POST
     */
    describe("POST /user/:id", () => {
        it("Cuando registro una persona correctamente", (done) => {
            chai.request(server)                
                .post("/user/15") // Cambiar por uno que no existe debe pegarse en la linea 75
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                });
        });

        it("Cuando registro un usuario que ya existe", (done) => {
           
            chai.request(server)                
                .post("/user/8")
                .end((err, response) => {
                    response.should.have.status(400);
                done();
                });
        });

    });
    /**
     * Test de la función GET 
     */
    describe("GET /user", () => {
        it("Cuando obtengo todos los resultados", (done) => {
            chai.request(server)
                .get("/user")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                });
        });

        it("Cuando no obtengo todos los resultados", (done) => {
            chai.request(server)
                .get("/users")
                .end((err, response) => {
                    response.should.have.status(404);
                done();
                });
        });

    });

    /**
     * Test de la función GET para obtener todos los usuarios
     */
    describe("GET /user/:id", () => {
        it("Cuando obtengo el usuario por OBJECT_ID", (done) => {
            chai.request(server)
                .get("/user/5fa835067c33738211894507")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                });
        });

        it("Cuando envio OBJECT_ID erroneo", (done) => {
            chai.request(server)
                .get("/user/5fa835067c337382118945071")
                .end((err, response) => {
                    response.should.have.status(400);
                done();
                });
        });

    });

    /**
     * Test de la función DELETE
     */
    describe("DELETE /user/:id", () => {

        it("Cuando elimino un usuario incorrectamente", (done) => {
           
            chai.request(server)                
                .delete("/user/x")
                .end((err, response) => {
                    response.should.have.status(400);
                done();
                });
        });

    });





});
