/* src/data/quizData.js */
const quizData = {
  CS: {
    dbms: {
      "ER Diagrams": [
        {
          question: "What does an 'Attribute' represent in an ER Diagram?",
          options: ["Entity set", "Property of an entity", "Relationship", "Primary key only"],
          correct: 1
        },
        {
          question: "Which shape represents an Entity in ER Diagrams?",
          options: ["Oval", "Diamond", "Rectangle", "Double Oval"],
          correct: 2
        }
      ],
      "Relational Model": [
        {
          question: "In the Relational Model, a row is called a:",
          options: ["Attribute", "Tuple", "Relation", "Degree"],
          correct: 1
        },
        {
          question: "The number of attributes in a relation is its:",
          options: ["Cardinality", "Domain", "Degree", "Schema"],
          correct: 2
        }
      ],
      "SQL Joins": [
        {
          question: "Which JOIN returns all rows when there is a match in one of the tables?",
          options: ["INNER JOIN", "LEFT JOIN", "FULL OUTER JOIN", "RIGHT JOIN"],
          correct: 2
        }
      ]
    },
    os: {
      "Introduction": [
        {
          question: "Which of the following is the main function of an OS?",
          options: ["Process Management", "Memory Management", "File Management", "All of the above"],
          correct: 3
        }
      ]
    }
  }
};

export default quizData;