package types

//struct of student making

type Student struct {
	Id int64 
	Name string `validate:"required"`
	Email string `validate:"required"`
	Age int `validate:"required"`
}