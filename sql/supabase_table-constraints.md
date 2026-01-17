| table_name    | constraint_type | constraint_name                    | column_name      | foreign_table_name | foreign_column_name |
| ------------- | --------------- | ---------------------------------- | ---------------- | ------------------ | ------------------- |
| list_items    | CHECK           | 2200_30034_14_not_null             | null             | null               | null                |
| list_items    | CHECK           | 2200_30034_3_not_null              | null             | null               | null                |
| list_items    | CHECK           | 2200_30034_15_not_null             | null             | null               | null                |
| list_items    | CHECK           | 2200_30034_1_not_null              | null             | null               | null                |
| list_items    | FOREIGN KEY     | list_items_parent_id_fkey          | parent_id        | list_items         | id                  |
| list_items    | FOREIGN KEY     | list_items_list_id_fkey            | list_id          | lists              | id                  |
| list_items    | PRIMARY KEY     | list_items_pkey                    | id               | list_items         | id                  |
| rec_requests  | CHECK           | 2200_59676_2_not_null              | null             | null               | null                |
| rec_requests  | CHECK           | 2200_59676_1_not_null              | null             | null               | null                |
| rec_requests  | CHECK           | 2200_59676_13_not_null             | null             | null               | null                |
| rec_requests  | CHECK           | 2200_59676_7_not_null              | null             | null               | null                |
| rec_requests  | CHECK           | 2200_59676_4_not_null              | null             | null               | null                |
| rec_requests  | FOREIGN KEY     | rec_requests_city_id_fkey          | city_id          | list_items         | id                  |
| rec_requests  | FOREIGN KEY     | fk_rec_requests_neighbourhood      | neighbourhood_id | list_items         | id                  |
| rec_requests  | FOREIGN KEY     | rec_requests_area_id_fkey          | area_id          | list_items         | id                  |
| rec_requests  | FOREIGN KEY     | rec_requests_best_response_id_fkey | best_response_id | rec_responses      | id                  |
| rec_requests  | FOREIGN KEY     | rec_requests_category_id_fkey      | category_id      | list_items         | id                  |
| rec_requests  | FOREIGN KEY     | rec_requests_subcategory_id_fkey   | subcategory_id   | list_items         | id                  |
| rec_requests  | FOREIGN KEY     | rec_requests_user_fkey             | user_id          | profiles           | id                  |
| rec_requests  | PRIMARY KEY     | rec_requests_pkey                  | id               | rec_requests       | id                  |
| rec_responses | CHECK           | 2200_59701_3_not_null              | null             | null               | null                |
| rec_responses | CHECK           | check_responder                    | null             | rec_responses      | guest_email         |
| rec_responses | CHECK           | check_responder                    | null             | rec_responses      | is_guest            |
| rec_responses | CHECK           | check_responder                    | null             | rec_responses      | user_id             |
| rec_responses | CHECK           | check_response_has_business        | null             | rec_responses      | business_id         |
| rec_responses | CHECK           | check_response_has_business        | null             | rec_responses      | business_name       |
| rec_responses | CHECK           | 2200_59701_1_not_null              | null             | null               | null                |
| rec_responses | CHECK           | 2200_59701_2_not_null              | null             | null               | null                |
| rec_responses | FOREIGN KEY     | rec_responses_request_id_fkey      | request_id       | rec_requests       | id                  |
| rec_responses | FOREIGN KEY     | rec_responses_business_id_fkey     | business_id      | businesses         | id                  |
| rec_responses | FOREIGN KEY     | rec_responses_user_id_fkey1        | user_id          | profiles           | id                  |
| rec_responses | FOREIGN KEY     | rec_responses_user_id_fkey         | user_id          | null               | null                |
| rec_responses | PRIMARY KEY     | rec_responses_pkey                 | id               | rec_responses      | id                  |