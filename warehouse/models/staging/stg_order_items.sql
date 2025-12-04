{{
  config(
    materialized='view'
  )
}}

select
    id,
    order_id,
    user_id,
    product_id,
    sale_price,
    discount,
    status,
    created_at,
    returned_at
from {{ source('raw', 'order_items') }}

