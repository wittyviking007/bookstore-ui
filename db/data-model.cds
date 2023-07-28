namespace my.bookshop;
using { Country, managed, Currency } from '@sap/cds/common';

entity Books {
  key ID : Integer;
  title  : localized String;
  descr    : localized String(1111);
  author : Association to Authors;
  stock  : Integer;
  price    : Decimal(9,2);
  currency : Currency;
  quantity  : Integer;
}

entity Authors {
  key ID : Integer;
  name   : String;
  books  : Association to many Books on books.author = $self;
}

entity Orders : managed {
  key ID  : UUID;
  book    : Association to Books;
  country : Country;
  amount  : Integer;
  orderName: String;
  bookName: String;
  price: Decimal(9, 2);
}
