{{
  config(
    materialized='view'
  )
}}

select
    id,
    user_id,
    status,
    created_at,
    shipped_at,
    delivered_at,
    returned_at
from {{ source('raw', 'orders') }}

