| table_name    | column_name      | data_type                | is_nullable | column_default                            | character_maximum_length |
| ------------- | ---------------- | ------------------------ | ----------- | ----------------------------------------- | ------------------------ |
| list_items    | id               | uuid                     | NO          | gen_random_uuid()                         | null                     |
| list_items    | list_id          | uuid                     | YES         | null                                      | null                     |
| list_items    | name             | text                     | NO          | null                                      | null                     |
| list_items    | sort_order       | integer                  | YES         | 0                                         | null                     |
| list_items    | parent_id        | uuid                     | YES         | null                                      | null                     |
| list_items    | code_name        | text                     | YES         | null                                      | null                     |
| list_items    | metadata         | jsonb                    | YES         | '{}'::jsonb                               | null                     |
| list_items    | bounds_north     | numeric                  | YES         | null                                      | null                     |
| list_items    | bounds_south     | numeric                  | YES         | null                                      | null                     |
| list_items    | bounds_east      | numeric                  | YES         | null                                      | null                     |
| list_items    | bounds_west      | numeric                  | YES         | null                                      | null                     |
| list_items    | center_lat       | numeric                  | YES         | null                                      | null                     |
| list_items    | center_lng       | numeric                  | YES         | null                                      | null                     |
| list_items    | created_at       | timestamp with time zone | NO          | now()                                     | null                     |
| list_items    | updated_at       | timestamp with time zone | NO          | now()                                     | null                     |
| rec_requests  | id               | uuid                     | NO          | gen_random_uuid()                         | null                     |
| rec_requests  | created_at       | timestamp with time zone | NO          | now()                                     | null                     |
| rec_requests  | user_id          | uuid                     | YES         | null                                      | null                     |
| rec_requests  | title            | text                     | NO          | null                                      | null                     |
| rec_requests  | city_id          | uuid                     | YES         | null                                      | null                     |
| rec_requests  | category_id      | uuid                     | YES         | null                                      | null                     |
| rec_requests  | status           | text                     | NO          | 'open'::text                              | null                     |
| rec_requests  | area_id          | uuid                     | YES         | null                                      | null                     |
| rec_requests  | subcategory_id   | uuid                     | YES         | null                                      | null                     |
| rec_requests  | context          | text                     | YES         | null                                      | null                     |
| rec_requests  | best_response_id | uuid                     | YES         | null                                      | null                     |
| rec_requests  | neighbourhood_id | uuid                     | YES         | null                                      | null                     |
| rec_requests  | share_token      | text                     | NO          | encode(gen_random_bytes(16), 'hex'::text) | null                     |
| rec_requests  | is_public        | boolean                  | YES         | true                                      | null                     |
| rec_responses | id               | uuid                     | NO          | gen_random_uuid()                         | null                     |
| rec_responses | created_at       | timestamp with time zone | NO          | now()                                     | null                     |
| rec_responses | request_id       | uuid                     | NO          | null                                      | null                     |
| rec_responses | user_id          | uuid                     | YES         | null                                      | null                     |
| rec_responses | business_id      | uuid                     | YES         | null                                      | null                     |
| rec_responses | comment          | text                     | YES         | null                                      | null                     |
| rec_responses | is_thanked       | boolean                  | YES         | false                                     | null                     |
| rec_responses | guest_name       | text                     | YES         | null                                      | null                     |
| rec_responses | guest_email      | text                     | YES         | null                                      | null                     |
| rec_responses | is_guest         | boolean                  | YES         | false                                     | null                     |
| rec_responses | business_name    | text                     | YES         | null                                      | null                     |
| rec_responses | email            | text                     | YES         | null                                      | null                     |
| rec_responses | instagram        | text                     | YES         | null                                      | null                     |
| rec_responses | website          | text                     | YES         | null                                      | null                     |
| rec_responses | location         | text                     | YES         | null                                      | null                     |
| rec_responses | notes            | text                     | YES         | null                                      | null                     |
| rec_responses | responder_name   | text                     | YES         | null                                      | null                     |