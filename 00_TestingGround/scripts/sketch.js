// Definition
var person = {
  firstName: 'Juan',
  lastName: 'Saldarriaga',
  id: 555555555,
  fullName: function(){
    return this.firstName + ' ' + this.lastName;
  }
}
// Running
console.log(person.fullName()); // This should print 'Juan Saldarriaga'
