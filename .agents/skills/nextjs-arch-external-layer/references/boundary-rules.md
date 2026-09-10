# Boundary Rules

- `external/handler/**` is the only layer callable from `features/**`.
- `external/service/**` owns business logic.
- `external/repository/**` owns database persistence.
- `external/dto/**` owns input and output contracts.
- `external/domain/**` must not be imported directly from feature code.

Related enforced behavior in the repository:

- service import restrictions
- action import restrictions
- server-only usage rules