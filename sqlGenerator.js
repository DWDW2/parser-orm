function generateSQL(ast) {
  if (ast.type !== 'Program') throw new Error('Invalid AST: Expected Program node');
  return generateTable(ast.body);
}

function generateTable(tableNode) {
  if (tableNode.type !== 'TableLiteral') throw new Error('Invalid AST: Expected TableLiteral node');
  
  const tableName = tableNode.name;
  const columns = tableNode.columns.map(generateColumn).join(',\n  ');
  
  return `CREATE TABLE ${tableName} (\n  ${columns}\n);`;
}

function generateColumn(columnNode) {
  if (columnNode.type !== 'ColumnDefinition') throw new Error('Invalid AST: Expected ColumnDefinition node');
  
  const parts = [columnNode.name];
  
  if (typeof columnNode.dataType === 'string') {
    parts.push(columnNode.dataType.toUpperCase());
  } else if (columnNode.dataType.type === 'TimestampWithDefault') {
    parts.push('TIMESTAMP');
  }
  
  const constraints = [];
  
  columnNode.constraints.forEach(constraint => {
    switch (constraint.type) {
      case 'PrimaryKey':
        constraints.push('PRIMARY KEY');
        break;
      case 'NotNull':
        constraints.push('NOT NULL');
        break;
      case 'Unique':
        constraints.push('UNIQUE');
        break;
      case 'Default':
        constraints.push(`DEFAULT ${generateDefaultValue(constraint.value)}`);
        break;
    }
  });
  
  if (columnNode.dataType.type === 'TimestampWithDefault') {
    constraints.push('DEFAULT CURRENT_TIMESTAMP');
  }
  
  if (constraints.length > 0) {
    parts.push(constraints.join(' '));
  }
  
  return parts.join(' ');
}

function generateDefaultValue(value) {
  if (value.type === 'CurrentTimestamp') {
    return 'CURRENT_TIMESTAMP';
  } else if (value.type === 'StringLiteral') {
    return `'${value.value}'`;
  } else if (value.type === 'NumericLiteral') {
    return value.value;
  } else if (value.type === 'ArrayLiteral') {
    return `ARRAY[${value.elements.map(generateDefaultValue).join(', ')}]`;
  }
  return value;
}

export { generateSQL }; 