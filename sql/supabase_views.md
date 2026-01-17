| table_name            | view_definition                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| web_request_feed      |  SELECT r.id,
    r.share_token,
    r.title,
    r.context,
    r.created_at,
    r.status,
    r.user_id,
    r.area_id,
    area.name AS location_name,
    ((area.metadata ->> 'user_generated'::text))::boolean AS location_user_generated,
    r.category_id,
    cat.name AS business_type_name,
    r.subcategory_id,
    subcat.name AS subcategory_name,
    ( SELECT count(*) AS count
           FROM rec_responses
          WHERE (rec_responses.request_id = r.id)) AS response_count,
    COALESCE(p.username, p.full_name, 'Someone'::text) AS requester_name
   FROM ((((rec_requests r
     LEFT JOIN list_items area ON ((r.area_id = area.id)))
     LEFT JOIN list_items cat ON ((r.category_id = cat.id)))
     LEFT JOIN list_items subcat ON ((r.subcategory_id = subcat.id)))
     LEFT JOIN profiles p ON ((r.user_id = p.id)))
  WHERE (r.is_public = true)
  ORDER BY r.created_at DESC; |
| web_request_responses |  SELECT rr.id,
    rr.request_id,
    rr.created_at,
    rr.is_guest,
    rr.responder_name,
    COALESCE(b.name, rr.business_name) AS business_name,
    COALESCE(b.website, rr.website) AS website,
    rr.email,
    rr.instagram,
    COALESCE(area.name, rr.location) AS location,
    COALESCE(rr.notes, rr.comment) AS notes,
    rr.user_id,
    COALESCE(p.username, p.full_name) AS voucher_name,
        CASE
            WHEN (rr.business_id IS NOT NULL) THEN true
            ELSE false
        END AS is_business_linked
   FROM (((rec_responses rr
     LEFT JOIN businesses b ON ((rr.business_id = b.id)))
     LEFT JOIN list_items area ON ((b.area_id = area.id)))
     LEFT JOIN profiles p ON ((rr.user_id = p.id)))
  ORDER BY rr.created_at DESC;                                                                                                                                         |