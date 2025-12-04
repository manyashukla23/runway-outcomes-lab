{{
  config(
    materialized='view'
  )
}}

select
    id,
    brand,
    department,
    category,
    name,
    retail_price,
    cost,
    created_at
from {{ source('raw', 'products') }}

