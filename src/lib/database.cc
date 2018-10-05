#include <napi.h>
#include <stdlib.h>
#include <ctype.h>

#define QUERY_SUCCESSFUL 0
#define QUERY_INVALID 1
#define QUERY_TABLE_CREATED 2
#define QUERY_INSERT_SUCCESSFUL 3
#define QUERY_SELECT_SUCCESSFUL 4

// Maximum input string length
#define INPUT_LENGTH 102400

// Maximum output string length
#define OUTPUT_LENGTH 102400

// Maximum length of a single argument string in a query
#define ARGUMENT_LENGTH 1024

// Maximum number of arguments to be accepted in a query
#define MAX_ARGS 128

typedef struct Table Table;

struct Table {
  std::vector<std::string> columns;
  std::vector<std::string> values;
  Table *next;
};

typedef struct Database Database;

struct Database {
  Table *schema;
};

/**
 * Creates a new table in the database.
 * Returns 0 if successful otherwise returns error code.
 * 
 * @param {std::string}               table_name
 * @param {std::vector<std::string>}  columns
 * 
 * @return int
 */ 
int create_table(
  std::string table_name,
  std::vector<std::string> columns
)
{
  return QUERY_SUCCESSFUL;
}

/**
 * Inserts a new row into a table.
 * Returns 0 if successful otherwise returns error code.
 * 
 * @param {std::string}                table_name
 * @param {std::vector<std::string>}   column_names
 * @param {std::vector<std::string>}   values
 * 
 * @return int
 */ 
int insert_into(
  std::string table_name,
  std::vector<std::string> column_names,
  std::vector<std::string> values
)
{
  return QUERY_SUCCESSFUL;
}

/**
 * Selects all rows from a table. Formatted and placed into buffer.
 * Returns 0 if successful otherwise returns error code.
 * 
 * @param {char*}         buffer
 * @param {std::string}   table_name
 * 
 * @return int
 */ 
int select_from(
  char *buffer,
  std::string table_name
)
{
  return QUERY_SUCCESSFUL;
}

/**
 * Run a query, fill the buffer string with result.
 * Returns 0 if successful otherwise returns error code.
 * 
 * @param {char*}   buffer
 * @param {char*}   query
 * 
 * @return int
 */ 
int query(
  char *buffer,
  char *query
)
{
  char qcpy[INPUT_LENGTH];
  strcpy(qcpy, query);

  std::vector<std::string> argument_values;

  bool flag_in_brackets = false;
  int a_length = 0;
  char current_argument[ARGUMENT_LENGTH];

  for (size_t i = 0; i < sizeof(qcpy) && i < strlen(qcpy); i++)
  {
    if (qcpy[i] == '(')
    {
      if (flag_in_brackets)
      {
        return QUERY_INVALID;
      }

      flag_in_brackets = true;
    }
    else if (qcpy[i] == ')')
    {
      if (!flag_in_brackets)
      {
        return QUERY_INVALID;
      }

      flag_in_brackets = false;
    }
    // End of argument
    else if (isspace(qcpy[i]) && !flag_in_brackets)
    {
      argument_values.push_back(current_argument);
      memset(current_argument, 0, strlen(current_argument));
    }
    // Not end of line
    else if (qcpy[i] != ';')
    {
      // Read a single character into the argument buffer
      current_argument[a_length++] = qcpy[i];
    }
    // End of line
    else if (qcpy[i] == ';')
    {
      argument_values.push_back(current_argument);
      memset(current_argument, 0, strlen(current_argument));

      while (qcpy[i] != '\n')
      {
        i++;
      }

      i--;
    }
  }

  for (size_t i = 0; i < argument_values.size(); i++)
  {
    sprintf(buffer + strlen(buffer), "%s\n", argument_values.at(i).c_str());
    return 0;
  }

  if (strcmp(argument_values.at(0).c_str(), "CREATE") == 0)
  {
    std::vector<std::string> column_names;

    if (argument_values.size() < 3)
    {
      return QUERY_INVALID;
    }

    // 0      1     2     3
    // CREATE TABLE table (column1 type, column2 type);
    return create_table(argument_values.at(2), column_names);
  }
  else if (strcmp(argument_values.at(0).c_str(), "INSERT") == 0)
  {
    std::vector<std::string> column_names;
    std::vector<std::string> values;

    if (argument_values.size() < 3)
    {
      return QUERY_INVALID;
    }

    // 0      1    2     3                       4      5
    // INSERT INTO table (id INTEGER, name TEXT) VALUES (1, bob) 
    return insert_into(argument_values.at(2), column_names, values);
  }
  else if (strcmp(argument_values.at(0).c_str(), "SELECT") == 0)
  {
    if (argument_values.size() < 4)
    {
      return QUERY_INVALID;
    }

    // 0      1 2    3;
    // SELECT * FROM table;
    return select_from(buffer, argument_values.at(3));
  }
  else
  {
    return QUERY_INVALID;
  }
}




Napi::String Entry(const Napi::CallbackInfo& info)
{
  Napi::Env env = info.Env();

  if (info.Length() != 1) {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return Napi::String::New(env, "Must provide 1 parameter");
  }

  if (!info[0].IsString()) {
    Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
    return Napi::String::New(env, "Must provide a string");
  }

  // Extract query from input parameters
  char arg0[INPUT_LENGTH];
  char buffer[OUTPUT_LENGTH];
  size_t* number_of_bytes_copied = NULL;
  napi_get_value_string_utf8(env, info[0], arg0, INPUT_LENGTH, number_of_bytes_copied);

  if (*number_of_bytes_copied == 0)
  {
    sprintf(buffer, "Number of bytes copied == %zu", *number_of_bytes_copied);
    Napi::TypeError::New(env, buffer).ThrowAsJavaScriptException();
    return Napi::String::New(env, buffer);
  }

  if (strlen(arg0) == 0)
  {
    sprintf(buffer, "Empty query");
    Napi::TypeError::New(env, buffer).ThrowAsJavaScriptException();
    return Napi::String::New(env, buffer);
  }

  switch (query(buffer, arg0))
  {
    case QUERY_INVALID:
      sprintf(buffer, "Query invalid: %s", arg0);
      Napi::TypeError::New(env, buffer).ThrowAsJavaScriptException();
      return Napi::String::New(env, buffer);
    default:
      return Napi::String::New(env, buffer);
  }  
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  return Napi::Function::New(env, Entry);
}

NODE_API_MODULE(database, Init)

/**
 * database.cc
 * 
 * Created by:
 *   - David Disch
 *     - Twitter: @auspicus
 *     - GitHub: @auspicus
 */