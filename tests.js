var request = require('supertest');
var app = require("./index");


describe('Add new user', function(){
  it("Return a 200 status code and email after email assignment", function(done){
    request(app)
      .post('/users/')
	  .send({email: "andrew@andrewmcgill.me", facebookid: "131231"})
      .expect(200)
	  .expect("\"Added andrew@andrewmcgill.me\"")
      .end(function(error){
        if(error) throw error;
        done();
      });
  });
});

describe('Pull user information', function(){
  it("Return a 200 status code and JSON after supplying userid", function(done){
    request(app)
      .get('/users/3')
      .expect(200)
	  .expect('[{"userid":3,"email":"andrew@andrewmcgill.me","facebookid":"131231"}]', done)
  });
  
  it("Return a 200 status code and JSON after supplying email", function(done){
    request(app)
      .get('/users/?email=andrew@andrewmcgill.me')
      .expect(200)
	  .expect('[{"userid":3,"email":"andrew@andrewmcgill.me","facebookid":"131231"}]', done)
  });
  
  it("Return a 200 status code and JSON after supplying facebookid", function(done){
    request(app)
      .get('/users/?facebookid=131231')
      .expect(200)
	  .expect('[{"userid":3,"email":"andrew@andrewmcgill.me","facebookid":"131231"}]', done)
  });
  
});