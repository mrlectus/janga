import React, { Component } from "react";
import { DownloadExcel } from "react-excel-export";

const books = [
  {
    author: "Chinua Achebe",
    country: "Nigeria",
    language: "English",
    pages: 209,
    title: "Things Fall Apart",
    year: 1958,
  },
  {
    author: "Hans Christian Andersen",
    country: "Denmark",
    language: "Danish",
    pages: 784,
    title: "Fairy tales",
    year: 1836,
  },
  {
    author: "Dante Alighieri",
    country: "Italy",
    language: "Italian",
    pages: 928,
    title: "The Divine Comedy",
    year: 1315,
  },
];

class Excel extends Component {
  render() {
    return (
      <DownloadExcel
        data={books}
        buttonLabel="Export Data"
        fileName="sample-file"
        className="export-button"
      />
    );
  }
}

export default Excel;
