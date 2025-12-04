{{
  config(
    materialized='view'
  )
}}

select
    id,
    first_name,
    last_name,
    gender,
    age,
    country,
    city,
    state,
    email,
    created_at,
    updated_at
from {{ source('raw', 'users') }}

