/**
 * @schema AdminGetTransactionGroupsParams
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminGetTransactionGroupsParams
 * properties:
 *   id:
 *     oneOf:
 *       - type: string
 *         title: id
 *         description: The transaction group's ID.
 *       - type: array
 *         description: The transaction group's ID.
 *         items:
 *           type: string
 *           title: id
 *           description: The id's ID.
 *   code:
 *     oneOf:
 *       - type: string
 *         title: code
 *         description: The transaction group's code.
 *       - type: array
 *         description: The transaction group's code.
 *         items:
 *           type: string
 *           title: code
 *           description: The code's details.
 *   created_at:
 *     type: object
 *     description: The transaction group's created at.
 *     properties:
 *       $and:
 *         type: array
 *         description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *         items:
 *           type: object
 *         title: $and
 *       $or:
 *         type: array
 *         description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *         items:
 *           type: object
 *         title: $or
 *       $eq:
 *         oneOf:
 *           - type: string
 *             title: $eq
 *             description: Filter by an exact match.
 *           - type: array
 *             description: Filter by an exact match.
 *             items:
 *               type: string
 *               title: $eq
 *               description: Filter by an exact match.
 *       $ne:
 *         type: string
 *         title: $ne
 *         description: Filter by values not equal to this parameter.
 *       $in:
 *         type: array
 *         description: Filter by values in this array.
 *         items:
 *           type: string
 *           title: $in
 *           description: Filter by values in this array.
 *       $nin:
 *         type: array
 *         description: Filter by values not in this array.
 *         items:
 *           type: string
 *           title: $nin
 *           description: Filter by values not in this array.
 *       $not:
 *         oneOf:
 *           - type: string
 *             title: $not
 *             description: Filter by values not matching the conditions in this parameter.
 *           - type: object
 *             description: Filter by values not matching the conditions in this parameter.
 *             properties:
 *               $and:
 *                 type: array
 *                 description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                 items:
 *                   type: object
 *                 title: $and
 *               $or:
 *                 type: array
 *                 description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                 items:
 *                   type: object
 *                 title: $or
 *               $eq:
 *                 oneOf:
 *                   - type: string
 *                     title: $eq
 *                     description: Filter by an exact match.
 *                   - type: array
 *                     description: Filter by an exact match.
 *                     items:
 *                       type: string
 *                       title: $eq
 *                       description: Filter by an exact match.
 *               $ne:
 *                 type: string
 *                 title: $ne
 *                 description: Filter by values not equal to this parameter.
 *               $in:
 *                 type: array
 *                 description: Filter by values in this array.
 *                 items:
 *                   type: string
 *                   title: $in
 *                   description: Filter by values in this array.
 *               $nin:
 *                 type: array
 *                 description: Filter by values not in this array.
 *                 items:
 *                   type: string
 *                   title: $nin
 *                   description: Filter by values not in this array.
 *               $not:
 *                 oneOf:
 *                   - type: string
 *                     title: $not
 *                     description: Filter by values not matching the conditions in this parameter.
 *                   - type: object
 *                     description: Filter by values not matching the conditions in this parameter.
 *                     properties:
 *                       $and:
 *                         type: array
 *                         description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                         items:
 *                           type: object
 *                         title: $and
 *                       $or:
 *                         type: array
 *                         description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                         items:
 *                           type: object
 *                         title: $or
 *                       $eq:
 *                         oneOf:
 *                           - type: string
 *                             title: $eq
 *                             description: Filter by an exact match.
 *                           - type: array
 *                             description: Filter by an exact match.
 *                             items:
 *                               type: string
 *                               title: $eq
 *                               description: Filter by an exact match.
 *                       $ne:
 *                         type: string
 *                         title: $ne
 *                         description: Filter by values not equal to this parameter.
 *                       $in:
 *                         type: array
 *                         description: Filter by values in this array.
 *                         items:
 *                           type: string
 *                           title: $in
 *                           description: Filter by values in this array.
 *                       $nin:
 *                         type: array
 *                         description: Filter by values not in this array.
 *                         items:
 *                           type: string
 *                           title: $nin
 *                           description: Filter by values not in this array.
 *                       $not:
 *                         oneOf:
 *                           - type: string
 *                             title: $not
 *                             description: Filter by values not matching the conditions in this parameter.
 *                           - type: object
 *                             description: Filter by values not matching the conditions in this parameter.
 *                             properties:
 *                               $and:
 *                                 type: array
 *                                 description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                 items:
 *                                   type: object
 *                                 title: $and
 *                               $or:
 *                                 type: array
 *                                 description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                 items:
 *                                   type: object
 *                                 title: $or
 *                               $eq:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $eq
 *                                     description: Filter by an exact match.
 *                                   - type: array
 *                                     description: Filter by an exact match.
 *                                     items:
 *                                       type: string
 *                                       title: $eq
 *                                       description: Filter by an exact match.
 *                               $ne:
 *                                 type: string
 *                                 title: $ne
 *                                 description: Filter by values not equal to this parameter.
 *                               $in:
 *                                 type: array
 *                                 description: Filter by values in this array.
 *                                 items:
 *                                   type: string
 *                                   title: $in
 *                                   description: Filter by values in this array.
 *                               $nin:
 *                                 type: array
 *                                 description: Filter by values not in this array.
 *                                 items:
 *                                   type: string
 *                                   title: $nin
 *                                   description: Filter by values not in this array.
 *                               $not:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $not
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                   - type: object
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                     properties:
 *                                       $and:
 *                                         type: array
 *                                         description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                         items:
 *                                           type: object
 *                                         title: $and
 *                                       $or:
 *                                         type: array
 *                                         description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                         items:
 *                                           type: object
 *                                         title: $or
 *                                       $eq:
 *                                         oneOf:
 *                                           - type: string
 *                                             title: $eq
 *                                             description: Filter by an exact match.
 *                                           - type: array
 *                                             description: Filter by an exact match.
 *                                             items:
 *                                               type: string
 *                                               title: $eq
 *                                               description: Filter by an exact match.
 *                                       $ne:
 *                                         type: string
 *                                         title: $ne
 *                                         description: Filter by values not equal to this parameter.
 *                                       $in:
 *                                         type: array
 *                                         description: Filter by values in this array.
 *                                         items:
 *                                           type: string
 *                                           title: $in
 *                                           description: Filter by values in this array.
 *                                       $nin:
 *                                         type: array
 *                                         description: Filter by values not in this array.
 *                                         items:
 *                                           type: string
 *                                           title: $nin
 *                                           description: Filter by values not in this array.
 *                                       $not:
 *                                         oneOf:
 *                                           - type: string
 *                                             title: $not
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                           - type: object
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                           - type: array
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                             items:
 *                                               type: string
 *                                               title: $not
 *                                               description: Filter by values not matching the conditions in this parameter.
 *                                           - type: object
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                           - type: array
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                             items: {}
 *                                       $gt:
 *                                         type: string
 *                                         title: $gt
 *                                         description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                                       $gte:
 *                                         type: string
 *                                         title: $gte
 *                                         description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                                       $lt:
 *                                         type: string
 *                                         title: $lt
 *                                         description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                                       $lte:
 *                                         type: string
 *                                         title: $lte
 *                                         description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                                       $like:
 *                                         type: string
 *                                         title: $like
 *                                         description: Apply a `like` filter. Useful for strings only.
 *                                       $re:
 *                                         type: string
 *                                         title: $re
 *                                         description: Apply a regex filter. Useful for strings only.
 *                                       $ilike:
 *                                         type: string
 *                                         title: $ilike
 *                                         description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                                       $fulltext:
 *                                         type: string
 *                                         title: $fulltext
 *                                         description: Filter to apply on full-text properties.
 *                                       $overlap:
 *                                         type: array
 *                                         description: Filter arrays that have overlapping values with this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $overlap
 *                                           description: Filter arrays that have overlapping values with this parameter.
 *                                       $contains:
 *                                         type: array
 *                                         description: Filter arrays that contain some of the values of this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $contains
 *                                           description: Filter arrays that contain some of the values of this parameter.
 *                                       $contained:
 *                                         type: array
 *                                         description: Filter arrays that contain all values of this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $contained
 *                                           description: Filter arrays that contain all values of this parameter.
 *                                       $exists:
 *                                         type: boolean
 *                                         title: $exists
 *                                         description: Filter by whether a value for this parameter exists (not `null`).
 *                                   - type: array
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                     items:
 *                                       type: string
 *                                       title: $not
 *                                       description: Filter by values not matching the conditions in this parameter.
 *                                   - type: object
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                     properties:
 *                                       $and:
 *                                         type: array
 *                                         description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                         items:
 *                                           type: object
 *                                         title: $and
 *                                       $or:
 *                                         type: array
 *                                         description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                         items:
 *                                           type: object
 *                                         title: $or
 *                                       $eq:
 *                                         type: array
 *                                         description: Filter by an exact match.
 *                                         items: {}
 *                                       $ne:
 *                                         type: string
 *                                         description: Filter by values not equal to this parameter.
 *                                         enum: []
 *                                       $in:
 *                                         type: array
 *                                         description: Filter by values in this array.
 *                                         items: {}
 *                                       $nin:
 *                                         type: array
 *                                         description: Filter by values not in this array.
 *                                         items: {}
 *                                       $not:
 *                                         oneOf:
 *                                           - type: object
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                           - type: array
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                             items: {}
 *                                       $gt:
 *                                         type: string
 *                                         description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $gte:
 *                                         type: string
 *                                         description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $lt:
 *                                         type: string
 *                                         description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $lte:
 *                                         type: string
 *                                         description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $like:
 *                                         type: string
 *                                         title: $like
 *                                         description: Apply a `like` filter. Useful for strings only.
 *                                       $re:
 *                                         type: string
 *                                         title: $re
 *                                         description: Apply a regex filter. Useful for strings only.
 *                                       $ilike:
 *                                         type: string
 *                                         title: $ilike
 *                                         description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                                       $fulltext:
 *                                         type: string
 *                                         title: $fulltext
 *                                         description: Filter to apply on full-text properties.
 *                                       $overlap:
 *                                         type: array
 *                                         description: Filter arrays that have overlapping values with this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $overlap
 *                                           description: Filter arrays that have overlapping values with this parameter.
 *                                       $contains:
 *                                         type: array
 *                                         description: Filter arrays that contain some of the values of this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $contains
 *                                           description: Filter arrays that contain some of the values of this parameter.
 *                                       $contained:
 *                                         type: array
 *                                         description: Filter arrays that contain all values of this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $contained
 *                                           description: Filter arrays that contain all values of this parameter.
 *                                       $exists:
 *                                         type: boolean
 *                                         title: $exists
 *                                         description: Filter by whether a value for this parameter exists (not `null`).
 *                                   - type: array
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                     items: {}
 *                               $gt:
 *                                 type: string
 *                                 title: $gt
 *                                 description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                               $gte:
 *                                 type: string
 *                                 title: $gte
 *                                 description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                               $lt:
 *                                 type: string
 *                                 title: $lt
 *                                 description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                               $lte:
 *                                 type: string
 *                                 title: $lte
 *                                 description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                               $like:
 *                                 type: string
 *                                 title: $like
 *                                 description: Apply a `like` filter. Useful for strings only.
 *                               $re:
 *                                 type: string
 *                                 title: $re
 *                                 description: Apply a regex filter. Useful for strings only.
 *                               $ilike:
 *                                 type: string
 *                                 title: $ilike
 *                                 description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                               $fulltext:
 *                                 type: string
 *                                 title: $fulltext
 *                                 description: Filter to apply on full-text properties.
 *                               $overlap:
 *                                 type: array
 *                                 description: Filter arrays that have overlapping values with this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $overlap
 *                                   description: Filter arrays that have overlapping values with this parameter.
 *                               $contains:
 *                                 type: array
 *                                 description: Filter arrays that contain some of the values of this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $contains
 *                                   description: Filter arrays that contain some of the values of this parameter.
 *                               $contained:
 *                                 type: array
 *                                 description: Filter arrays that contain all values of this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $contained
 *                                   description: Filter arrays that contain all values of this parameter.
 *                               $exists:
 *                                 type: boolean
 *                                 title: $exists
 *                                 description: Filter by whether a value for this parameter exists (not `null`).
 *                           - type: array
 *                             description: Filter by values not matching the conditions in this parameter.
 *                             items:
 *                               type: string
 *                               title: $not
 *                               description: Filter by values not matching the conditions in this parameter.
 *                           - type: object
 *                             description: Filter by values not matching the conditions in this parameter.
 *                             properties:
 *                               $and:
 *                                 type: array
 *                                 description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                 items:
 *                                   type: object
 *                                 title: $and
 *                               $or:
 *                                 type: array
 *                                 description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                 items:
 *                                   type: object
 *                                 title: $or
 *                               $eq:
 *                                 type: array
 *                                 description: Filter by an exact match.
 *                                 items: {}
 *                               $ne:
 *                                 type: string
 *                                 description: Filter by values not equal to this parameter.
 *                                 enum: []
 *                               $in:
 *                                 type: array
 *                                 description: Filter by values in this array.
 *                                 items: {}
 *                               $nin:
 *                                 type: array
 *                                 description: Filter by values not in this array.
 *                                 items: {}
 *                               $not:
 *                                 oneOf:
 *                                   - type: object
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                     properties:
 *                                       $and:
 *                                         type: array
 *                                         description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                         items:
 *                                           type: object
 *                                         title: $and
 *                                       $or:
 *                                         type: array
 *                                         description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                         items:
 *                                           type: object
 *                                         title: $or
 *                                       $eq:
 *                                         type: array
 *                                         description: Filter by an exact match.
 *                                         items: {}
 *                                       $ne:
 *                                         type: string
 *                                         description: Filter by values not equal to this parameter.
 *                                         enum: []
 *                                       $in:
 *                                         type: array
 *                                         description: Filter by values in this array.
 *                                         items: {}
 *                                       $nin:
 *                                         type: array
 *                                         description: Filter by values not in this array.
 *                                         items: {}
 *                                       $not:
 *                                         oneOf:
 *                                           - type: object
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                           - type: array
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                             items: {}
 *                                       $gt:
 *                                         type: string
 *                                         description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $gte:
 *                                         type: string
 *                                         description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $lt:
 *                                         type: string
 *                                         description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $lte:
 *                                         type: string
 *                                         description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $like:
 *                                         type: string
 *                                         title: $like
 *                                         description: Apply a `like` filter. Useful for strings only.
 *                                       $re:
 *                                         type: string
 *                                         title: $re
 *                                         description: Apply a regex filter. Useful for strings only.
 *                                       $ilike:
 *                                         type: string
 *                                         title: $ilike
 *                                         description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                                       $fulltext:
 *                                         type: string
 *                                         title: $fulltext
 *                                         description: Filter to apply on full-text properties.
 *                                       $overlap:
 *                                         type: array
 *                                         description: Filter arrays that have overlapping values with this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $overlap
 *                                           description: Filter arrays that have overlapping values with this parameter.
 *                                       $contains:
 *                                         type: array
 *                                         description: Filter arrays that contain some of the values of this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $contains
 *                                           description: Filter arrays that contain some of the values of this parameter.
 *                                       $contained:
 *                                         type: array
 *                                         description: Filter arrays that contain all values of this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $contained
 *                                           description: Filter arrays that contain all values of this parameter.
 *                                       $exists:
 *                                         type: boolean
 *                                         title: $exists
 *                                         description: Filter by whether a value for this parameter exists (not `null`).
 *                                   - type: array
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                     items: {}
 *                               $gt:
 *                                 type: string
 *                                 description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                                 enum: []
 *                               $gte:
 *                                 type: string
 *                                 description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                                 enum: []
 *                               $lt:
 *                                 type: string
 *                                 description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                                 enum: []
 *                               $lte:
 *                                 type: string
 *                                 description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                                 enum: []
 *                               $like:
 *                                 type: string
 *                                 title: $like
 *                                 description: Apply a `like` filter. Useful for strings only.
 *                               $re:
 *                                 type: string
 *                                 title: $re
 *                                 description: Apply a regex filter. Useful for strings only.
 *                               $ilike:
 *                                 type: string
 *                                 title: $ilike
 *                                 description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                               $fulltext:
 *                                 type: string
 *                                 title: $fulltext
 *                                 description: Filter to apply on full-text properties.
 *                               $overlap:
 *                                 type: array
 *                                 description: Filter arrays that have overlapping values with this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $overlap
 *                                   description: Filter arrays that have overlapping values with this parameter.
 *                               $contains:
 *                                 type: array
 *                                 description: Filter arrays that contain some of the values of this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $contains
 *                                   description: Filter arrays that contain some of the values of this parameter.
 *                               $contained:
 *                                 type: array
 *                                 description: Filter arrays that contain all values of this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $contained
 *                                   description: Filter arrays that contain all values of this parameter.
 *                               $exists:
 *                                 type: boolean
 *                                 title: $exists
 *                                 description: Filter by whether a value for this parameter exists (not `null`).
 *                           - type: array
 *                             description: Filter by values not matching the conditions in this parameter.
 *                             items: {}
 *                       $gt:
 *                         type: string
 *                         title: $gt
 *                         description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                       $gte:
 *                         type: string
 *                         title: $gte
 *                         description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                       $lt:
 *                         type: string
 *                         title: $lt
 *                         description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                       $lte:
 *                         type: string
 *                         title: $lte
 *                         description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                       $like:
 *                         type: string
 *                         title: $like
 *                         description: Apply a `like` filter. Useful for strings only.
 *                       $re:
 *                         type: string
 *                         title: $re
 *                         description: Apply a regex filter. Useful for strings only.
 *                       $ilike:
 *                         type: string
 *                         title: $ilike
 *                         description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                       $fulltext:
 *                         type: string
 *                         title: $fulltext
 *                         description: Filter to apply on full-text properties.
 *                       $overlap:
 *                         type: array
 *                         description: Filter arrays that have overlapping values with this parameter.
 *                         items:
 *                           type: string
 *                           title: $overlap
 *                           description: Filter arrays that have overlapping values with this parameter.
 *                       $contains:
 *                         type: array
 *                         description: Filter arrays that contain some of the values of this parameter.
 *                         items:
 *                           type: string
 *                           title: $contains
 *                           description: Filter arrays that contain some of the values of this parameter.
 *                       $contained:
 *                         type: array
 *                         description: Filter arrays that contain all values of this parameter.
 *                         items:
 *                           type: string
 *                           title: $contained
 *                           description: Filter arrays that contain all values of this parameter.
 *                       $exists:
 *                         type: boolean
 *                         title: $exists
 *                         description: Filter by whether a value for this parameter exists (not `null`).
 *                   - type: array
 *                     description: Filter by values not matching the conditions in this parameter.
 *                     items:
 *                       type: string
 *                       title: $not
 *                       description: Filter by values not matching the conditions in this parameter.
 *                   - type: object
 *                     description: Filter by values not matching the conditions in this parameter.
 *                     properties:
 *                       $and:
 *                         type: array
 *                         description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                         items:
 *                           type: object
 *                         title: $and
 *                       $or:
 *                         type: array
 *                         description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                         items:
 *                           type: object
 *                         title: $or
 *                       $eq:
 *                         type: array
 *                         description: Filter by an exact match.
 *                         items: {}
 *                       $ne:
 *                         type: string
 *                         description: Filter by values not equal to this parameter.
 *                         enum: []
 *                       $in:
 *                         type: array
 *                         description: Filter by values in this array.
 *                         items: {}
 *                       $nin:
 *                         type: array
 *                         description: Filter by values not in this array.
 *                         items: {}
 *                       $not:
 *                         oneOf:
 *                           - type: object
 *                             description: Filter by values not matching the conditions in this parameter.
 *                             properties:
 *                               $and:
 *                                 type: array
 *                                 description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                 items:
 *                                   type: object
 *                                 title: $and
 *                               $or:
 *                                 type: array
 *                                 description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                 items:
 *                                   type: object
 *                                 title: $or
 *                               $eq:
 *                                 type: array
 *                                 description: Filter by an exact match.
 *                                 items: {}
 *                               $ne:
 *                                 type: string
 *                                 description: Filter by values not equal to this parameter.
 *                                 enum: []
 *                               $in:
 *                                 type: array
 *                                 description: Filter by values in this array.
 *                                 items: {}
 *                               $nin:
 *                                 type: array
 *                                 description: Filter by values not in this array.
 *                                 items: {}
 *                               $not:
 *                                 oneOf:
 *                                   - type: object
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                     properties:
 *                                       $and:
 *                                         type: array
 *                                         description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                         items:
 *                                           type: object
 *                                         title: $and
 *                                       $or:
 *                                         type: array
 *                                         description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                         items:
 *                                           type: object
 *                                         title: $or
 *                                       $eq:
 *                                         type: array
 *                                         description: Filter by an exact match.
 *                                         items: {}
 *                                       $ne:
 *                                         type: string
 *                                         description: Filter by values not equal to this parameter.
 *                                         enum: []
 *                                       $in:
 *                                         type: array
 *                                         description: Filter by values in this array.
 *                                         items: {}
 *                                       $nin:
 *                                         type: array
 *                                         description: Filter by values not in this array.
 *                                         items: {}
 *                                       $not:
 *                                         oneOf:
 *                                           - type: object
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                           - type: array
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                             items: {}
 *                                       $gt:
 *                                         type: string
 *                                         description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $gte:
 *                                         type: string
 *                                         description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $lt:
 *                                         type: string
 *                                         description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $lte:
 *                                         type: string
 *                                         description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $like:
 *                                         type: string
 *                                         title: $like
 *                                         description: Apply a `like` filter. Useful for strings only.
 *                                       $re:
 *                                         type: string
 *                                         title: $re
 *                                         description: Apply a regex filter. Useful for strings only.
 *                                       $ilike:
 *                                         type: string
 *                                         title: $ilike
 *                                         description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                                       $fulltext:
 *                                         type: string
 *                                         title: $fulltext
 *                                         description: Filter to apply on full-text properties.
 *                                       $overlap:
 *                                         type: array
 *                                         description: Filter arrays that have overlapping values with this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $overlap
 *                                           description: Filter arrays that have overlapping values with this parameter.
 *                                       $contains:
 *                                         type: array
 *                                         description: Filter arrays that contain some of the values of this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $contains
 *                                           description: Filter arrays that contain some of the values of this parameter.
 *                                       $contained:
 *                                         type: array
 *                                         description: Filter arrays that contain all values of this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $contained
 *                                           description: Filter arrays that contain all values of this parameter.
 *                                       $exists:
 *                                         type: boolean
 *                                         title: $exists
 *                                         description: Filter by whether a value for this parameter exists (not `null`).
 *                                   - type: array
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                     items: {}
 *                               $gt:
 *                                 type: string
 *                                 description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                                 enum: []
 *                               $gte:
 *                                 type: string
 *                                 description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                                 enum: []
 *                               $lt:
 *                                 type: string
 *                                 description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                                 enum: []
 *                               $lte:
 *                                 type: string
 *                                 description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                                 enum: []
 *                               $like:
 *                                 type: string
 *                                 title: $like
 *                                 description: Apply a `like` filter. Useful for strings only.
 *                               $re:
 *                                 type: string
 *                                 title: $re
 *                                 description: Apply a regex filter. Useful for strings only.
 *                               $ilike:
 *                                 type: string
 *                                 title: $ilike
 *                                 description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                               $fulltext:
 *                                 type: string
 *                                 title: $fulltext
 *                                 description: Filter to apply on full-text properties.
 *                               $overlap:
 *                                 type: array
 *                                 description: Filter arrays that have overlapping values with this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $overlap
 *                                   description: Filter arrays that have overlapping values with this parameter.
 *                               $contains:
 *                                 type: array
 *                                 description: Filter arrays that contain some of the values of this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $contains
 *                                   description: Filter arrays that contain some of the values of this parameter.
 *                               $contained:
 *                                 type: array
 *                                 description: Filter arrays that contain all values of this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $contained
 *                                   description: Filter arrays that contain all values of this parameter.
 *                               $exists:
 *                                 type: boolean
 *                                 title: $exists
 *                                 description: Filter by whether a value for this parameter exists (not `null`).
 *                           - type: array
 *                             description: Filter by values not matching the conditions in this parameter.
 *                             items: {}
 *                       $gt:
 *                         type: string
 *                         description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                         enum: []
 *                       $gte:
 *                         type: string
 *                         description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                         enum: []
 *                       $lt:
 *                         type: string
 *                         description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                         enum: []
 *                       $lte:
 *                         type: string
 *                         description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                         enum: []
 *                       $like:
 *                         type: string
 *                         title: $like
 *                         description: Apply a `like` filter. Useful for strings only.
 *                       $re:
 *                         type: string
 *                         title: $re
 *                         description: Apply a regex filter. Useful for strings only.
 *                       $ilike:
 *                         type: string
 *                         title: $ilike
 *                         description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                       $fulltext:
 *                         type: string
 *                         title: $fulltext
 *                         description: Filter to apply on full-text properties.
 *                       $overlap:
 *                         type: array
 *                         description: Filter arrays that have overlapping values with this parameter.
 *                         items:
 *                           type: string
 *                           title: $overlap
 *                           description: Filter arrays that have overlapping values with this parameter.
 *                       $contains:
 *                         type: array
 *                         description: Filter arrays that contain some of the values of this parameter.
 *                         items:
 *                           type: string
 *                           title: $contains
 *                           description: Filter arrays that contain some of the values of this parameter.
 *                       $contained:
 *                         type: array
 *                         description: Filter arrays that contain all values of this parameter.
 *                         items:
 *                           type: string
 *                           title: $contained
 *                           description: Filter arrays that contain all values of this parameter.
 *                       $exists:
 *                         type: boolean
 *                         title: $exists
 *                         description: Filter by whether a value for this parameter exists (not `null`).
 *                   - type: array
 *                     description: Filter by values not matching the conditions in this parameter.
 *                     items: {}
 *               $gt:
 *                 type: string
 *                 title: $gt
 *                 description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *               $gte:
 *                 type: string
 *                 title: $gte
 *                 description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *               $lt:
 *                 type: string
 *                 title: $lt
 *                 description: Filter by values less than this parameter. Useful for numbers and dates only.
 *               $lte:
 *                 type: string
 *                 title: $lte
 *                 description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *               $like:
 *                 type: string
 *                 title: $like
 *                 description: Apply a `like` filter. Useful for strings only.
 *               $re:
 *                 type: string
 *                 title: $re
 *                 description: Apply a regex filter. Useful for strings only.
 *               $ilike:
 *                 type: string
 *                 title: $ilike
 *                 description: Apply a case-insensitive `like` filter. Useful for strings only.
 *               $fulltext:
 *                 type: string
 *                 title: $fulltext
 *                 description: Filter to apply on full-text properties.
 *               $overlap:
 *                 type: array
 *                 description: Filter arrays that have overlapping values with this parameter.
 *                 items:
 *                   type: string
 *                   title: $overlap
 *                   description: Filter arrays that have overlapping values with this parameter.
 *               $contains:
 *                 type: array
 *                 description: Filter arrays that contain some of the values of this parameter.
 *                 items:
 *                   type: string
 *                   title: $contains
 *                   description: Filter arrays that contain some of the values of this parameter.
 *               $contained:
 *                 type: array
 *                 description: Filter arrays that contain all values of this parameter.
 *                 items:
 *                   type: string
 *                   title: $contained
 *                   description: Filter arrays that contain all values of this parameter.
 *               $exists:
 *                 type: boolean
 *                 title: $exists
 *                 description: Filter by whether a value for this parameter exists (not `null`).
 *           - type: array
 *             description: Filter by values not matching the conditions in this parameter.
 *             items:
 *               type: string
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *       $gt:
 *         type: string
 *         title: $gt
 *         description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *       $gte:
 *         type: string
 *         title: $gte
 *         description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *       $lt:
 *         type: string
 *         title: $lt
 *         description: Filter by values less than this parameter. Useful for numbers and dates only.
 *       $lte:
 *         type: string
 *         title: $lte
 *         description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *       $like:
 *         type: string
 *         title: $like
 *         description: Apply a `like` filter. Useful for strings only.
 *       $re:
 *         type: string
 *         title: $re
 *         description: Apply a regex filter. Useful for strings only.
 *       $ilike:
 *         type: string
 *         title: $ilike
 *         description: Apply a case-insensitive `like` filter. Useful for strings only.
 *       $fulltext:
 *         type: string
 *         title: $fulltext
 *         description: Filter to apply on full-text properties.
 *       $overlap:
 *         type: array
 *         description: Filter arrays that have overlapping values with this parameter.
 *         items:
 *           type: string
 *           title: $overlap
 *           description: Filter arrays that have overlapping values with this parameter.
 *       $contains:
 *         type: array
 *         description: Filter arrays that contain some of the values of this parameter.
 *         items:
 *           type: string
 *           title: $contains
 *           description: Filter arrays that contain some of the values of this parameter.
 *       $contained:
 *         type: array
 *         description: Filter arrays that contain all values of this parameter.
 *         items:
 *           type: string
 *           title: $contained
 *           description: Filter arrays that contain all values of this parameter.
 *       $exists:
 *         type: boolean
 *         title: $exists
 *         description: Filter by whether a value for this parameter exists (not `null`).
 *   updated_at:
 *     type: object
 *     description: The transaction group's updated at.
 *     properties:
 *       $and:
 *         type: array
 *         description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *         items:
 *           type: object
 *         title: $and
 *       $or:
 *         type: array
 *         description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *         items:
 *           type: object
 *         title: $or
 *       $eq:
 *         oneOf:
 *           - type: string
 *             title: $eq
 *             description: Filter by an exact match.
 *           - type: array
 *             description: Filter by an exact match.
 *             items:
 *               type: string
 *               title: $eq
 *               description: Filter by an exact match.
 *       $ne:
 *         type: string
 *         title: $ne
 *         description: Filter by values not equal to this parameter.
 *       $in:
 *         type: array
 *         description: Filter by values in this array.
 *         items:
 *           type: string
 *           title: $in
 *           description: Filter by values in this array.
 *       $nin:
 *         type: array
 *         description: Filter by values not in this array.
 *         items:
 *           type: string
 *           title: $nin
 *           description: Filter by values not in this array.
 *       $not:
 *         oneOf:
 *           - type: string
 *             title: $not
 *             description: Filter by values not matching the conditions in this parameter.
 *           - type: object
 *             description: Filter by values not matching the conditions in this parameter.
 *             properties:
 *               $and:
 *                 type: array
 *                 description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                 items:
 *                   type: object
 *                 title: $and
 *               $or:
 *                 type: array
 *                 description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                 items:
 *                   type: object
 *                 title: $or
 *               $eq:
 *                 oneOf:
 *                   - type: string
 *                     title: $eq
 *                     description: Filter by an exact match.
 *                   - type: array
 *                     description: Filter by an exact match.
 *                     items:
 *                       type: string
 *                       title: $eq
 *                       description: Filter by an exact match.
 *               $ne:
 *                 type: string
 *                 title: $ne
 *                 description: Filter by values not equal to this parameter.
 *               $in:
 *                 type: array
 *                 description: Filter by values in this array.
 *                 items:
 *                   type: string
 *                   title: $in
 *                   description: Filter by values in this array.
 *               $nin:
 *                 type: array
 *                 description: Filter by values not in this array.
 *                 items:
 *                   type: string
 *                   title: $nin
 *                   description: Filter by values not in this array.
 *               $not:
 *                 oneOf:
 *                   - type: string
 *                     title: $not
 *                     description: Filter by values not matching the conditions in this parameter.
 *                   - type: object
 *                     description: Filter by values not matching the conditions in this parameter.
 *                     properties:
 *                       $and:
 *                         type: array
 *                         description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                         items:
 *                           type: object
 *                         title: $and
 *                       $or:
 *                         type: array
 *                         description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                         items:
 *                           type: object
 *                         title: $or
 *                       $eq:
 *                         oneOf:
 *                           - type: string
 *                             title: $eq
 *                             description: Filter by an exact match.
 *                           - type: array
 *                             description: Filter by an exact match.
 *                             items:
 *                               type: string
 *                               title: $eq
 *                               description: Filter by an exact match.
 *                       $ne:
 *                         type: string
 *                         title: $ne
 *                         description: Filter by values not equal to this parameter.
 *                       $in:
 *                         type: array
 *                         description: Filter by values in this array.
 *                         items:
 *                           type: string
 *                           title: $in
 *                           description: Filter by values in this array.
 *                       $nin:
 *                         type: array
 *                         description: Filter by values not in this array.
 *                         items:
 *                           type: string
 *                           title: $nin
 *                           description: Filter by values not in this array.
 *                       $not:
 *                         oneOf:
 *                           - type: string
 *                             title: $not
 *                             description: Filter by values not matching the conditions in this parameter.
 *                           - type: object
 *                             description: Filter by values not matching the conditions in this parameter.
 *                             properties:
 *                               $and:
 *                                 type: array
 *                                 description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                 items:
 *                                   type: object
 *                                 title: $and
 *                               $or:
 *                                 type: array
 *                                 description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                 items:
 *                                   type: object
 *                                 title: $or
 *                               $eq:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $eq
 *                                     description: Filter by an exact match.
 *                                   - type: array
 *                                     description: Filter by an exact match.
 *                                     items:
 *                                       type: string
 *                                       title: $eq
 *                                       description: Filter by an exact match.
 *                               $ne:
 *                                 type: string
 *                                 title: $ne
 *                                 description: Filter by values not equal to this parameter.
 *                               $in:
 *                                 type: array
 *                                 description: Filter by values in this array.
 *                                 items:
 *                                   type: string
 *                                   title: $in
 *                                   description: Filter by values in this array.
 *                               $nin:
 *                                 type: array
 *                                 description: Filter by values not in this array.
 *                                 items:
 *                                   type: string
 *                                   title: $nin
 *                                   description: Filter by values not in this array.
 *                               $not:
 *                                 oneOf:
 *                                   - type: string
 *                                     title: $not
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                   - type: object
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                     properties:
 *                                       $and:
 *                                         type: array
 *                                         description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                         items:
 *                                           type: object
 *                                         title: $and
 *                                       $or:
 *                                         type: array
 *                                         description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                         items:
 *                                           type: object
 *                                         title: $or
 *                                       $eq:
 *                                         oneOf:
 *                                           - type: string
 *                                             title: $eq
 *                                             description: Filter by an exact match.
 *                                           - type: array
 *                                             description: Filter by an exact match.
 *                                             items:
 *                                               type: string
 *                                               title: $eq
 *                                               description: Filter by an exact match.
 *                                       $ne:
 *                                         type: string
 *                                         title: $ne
 *                                         description: Filter by values not equal to this parameter.
 *                                       $in:
 *                                         type: array
 *                                         description: Filter by values in this array.
 *                                         items:
 *                                           type: string
 *                                           title: $in
 *                                           description: Filter by values in this array.
 *                                       $nin:
 *                                         type: array
 *                                         description: Filter by values not in this array.
 *                                         items:
 *                                           type: string
 *                                           title: $nin
 *                                           description: Filter by values not in this array.
 *                                       $not:
 *                                         oneOf:
 *                                           - type: string
 *                                             title: $not
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                           - type: object
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                           - type: array
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                             items:
 *                                               type: string
 *                                               title: $not
 *                                               description: Filter by values not matching the conditions in this parameter.
 *                                           - type: object
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                           - type: array
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                             items: {}
 *                                       $gt:
 *                                         type: string
 *                                         title: $gt
 *                                         description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                                       $gte:
 *                                         type: string
 *                                         title: $gte
 *                                         description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                                       $lt:
 *                                         type: string
 *                                         title: $lt
 *                                         description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                                       $lte:
 *                                         type: string
 *                                         title: $lte
 *                                         description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                                       $like:
 *                                         type: string
 *                                         title: $like
 *                                         description: Apply a `like` filter. Useful for strings only.
 *                                       $re:
 *                                         type: string
 *                                         title: $re
 *                                         description: Apply a regex filter. Useful for strings only.
 *                                       $ilike:
 *                                         type: string
 *                                         title: $ilike
 *                                         description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                                       $fulltext:
 *                                         type: string
 *                                         title: $fulltext
 *                                         description: Filter to apply on full-text properties.
 *                                       $overlap:
 *                                         type: array
 *                                         description: Filter arrays that have overlapping values with this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $overlap
 *                                           description: Filter arrays that have overlapping values with this parameter.
 *                                       $contains:
 *                                         type: array
 *                                         description: Filter arrays that contain some of the values of this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $contains
 *                                           description: Filter arrays that contain some of the values of this parameter.
 *                                       $contained:
 *                                         type: array
 *                                         description: Filter arrays that contain all values of this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $contained
 *                                           description: Filter arrays that contain all values of this parameter.
 *                                       $exists:
 *                                         type: boolean
 *                                         title: $exists
 *                                         description: Filter by whether a value for this parameter exists (not `null`).
 *                                   - type: array
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                     items:
 *                                       type: string
 *                                       title: $not
 *                                       description: Filter by values not matching the conditions in this parameter.
 *                                   - type: object
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                     properties:
 *                                       $and:
 *                                         type: array
 *                                         description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                         items:
 *                                           type: object
 *                                         title: $and
 *                                       $or:
 *                                         type: array
 *                                         description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                         items:
 *                                           type: object
 *                                         title: $or
 *                                       $eq:
 *                                         type: array
 *                                         description: Filter by an exact match.
 *                                         items: {}
 *                                       $ne:
 *                                         type: string
 *                                         description: Filter by values not equal to this parameter.
 *                                         enum: []
 *                                       $in:
 *                                         type: array
 *                                         description: Filter by values in this array.
 *                                         items: {}
 *                                       $nin:
 *                                         type: array
 *                                         description: Filter by values not in this array.
 *                                         items: {}
 *                                       $not:
 *                                         oneOf:
 *                                           - type: object
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                           - type: array
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                             items: {}
 *                                       $gt:
 *                                         type: string
 *                                         description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $gte:
 *                                         type: string
 *                                         description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $lt:
 *                                         type: string
 *                                         description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $lte:
 *                                         type: string
 *                                         description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $like:
 *                                         type: string
 *                                         title: $like
 *                                         description: Apply a `like` filter. Useful for strings only.
 *                                       $re:
 *                                         type: string
 *                                         title: $re
 *                                         description: Apply a regex filter. Useful for strings only.
 *                                       $ilike:
 *                                         type: string
 *                                         title: $ilike
 *                                         description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                                       $fulltext:
 *                                         type: string
 *                                         title: $fulltext
 *                                         description: Filter to apply on full-text properties.
 *                                       $overlap:
 *                                         type: array
 *                                         description: Filter arrays that have overlapping values with this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $overlap
 *                                           description: Filter arrays that have overlapping values with this parameter.
 *                                       $contains:
 *                                         type: array
 *                                         description: Filter arrays that contain some of the values of this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $contains
 *                                           description: Filter arrays that contain some of the values of this parameter.
 *                                       $contained:
 *                                         type: array
 *                                         description: Filter arrays that contain all values of this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $contained
 *                                           description: Filter arrays that contain all values of this parameter.
 *                                       $exists:
 *                                         type: boolean
 *                                         title: $exists
 *                                         description: Filter by whether a value for this parameter exists (not `null`).
 *                                   - type: array
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                     items: {}
 *                               $gt:
 *                                 type: string
 *                                 title: $gt
 *                                 description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                               $gte:
 *                                 type: string
 *                                 title: $gte
 *                                 description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                               $lt:
 *                                 type: string
 *                                 title: $lt
 *                                 description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                               $lte:
 *                                 type: string
 *                                 title: $lte
 *                                 description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                               $like:
 *                                 type: string
 *                                 title: $like
 *                                 description: Apply a `like` filter. Useful for strings only.
 *                               $re:
 *                                 type: string
 *                                 title: $re
 *                                 description: Apply a regex filter. Useful for strings only.
 *                               $ilike:
 *                                 type: string
 *                                 title: $ilike
 *                                 description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                               $fulltext:
 *                                 type: string
 *                                 title: $fulltext
 *                                 description: Filter to apply on full-text properties.
 *                               $overlap:
 *                                 type: array
 *                                 description: Filter arrays that have overlapping values with this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $overlap
 *                                   description: Filter arrays that have overlapping values with this parameter.
 *                               $contains:
 *                                 type: array
 *                                 description: Filter arrays that contain some of the values of this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $contains
 *                                   description: Filter arrays that contain some of the values of this parameter.
 *                               $contained:
 *                                 type: array
 *                                 description: Filter arrays that contain all values of this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $contained
 *                                   description: Filter arrays that contain all values of this parameter.
 *                               $exists:
 *                                 type: boolean
 *                                 title: $exists
 *                                 description: Filter by whether a value for this parameter exists (not `null`).
 *                           - type: array
 *                             description: Filter by values not matching the conditions in this parameter.
 *                             items:
 *                               type: string
 *                               title: $not
 *                               description: Filter by values not matching the conditions in this parameter.
 *                           - type: object
 *                             description: Filter by values not matching the conditions in this parameter.
 *                             properties:
 *                               $and:
 *                                 type: array
 *                                 description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                 items:
 *                                   type: object
 *                                 title: $and
 *                               $or:
 *                                 type: array
 *                                 description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                 items:
 *                                   type: object
 *                                 title: $or
 *                               $eq:
 *                                 type: array
 *                                 description: Filter by an exact match.
 *                                 items: {}
 *                               $ne:
 *                                 type: string
 *                                 description: Filter by values not equal to this parameter.
 *                                 enum: []
 *                               $in:
 *                                 type: array
 *                                 description: Filter by values in this array.
 *                                 items: {}
 *                               $nin:
 *                                 type: array
 *                                 description: Filter by values not in this array.
 *                                 items: {}
 *                               $not:
 *                                 oneOf:
 *                                   - type: object
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                     properties:
 *                                       $and:
 *                                         type: array
 *                                         description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                         items:
 *                                           type: object
 *                                         title: $and
 *                                       $or:
 *                                         type: array
 *                                         description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                         items:
 *                                           type: object
 *                                         title: $or
 *                                       $eq:
 *                                         type: array
 *                                         description: Filter by an exact match.
 *                                         items: {}
 *                                       $ne:
 *                                         type: string
 *                                         description: Filter by values not equal to this parameter.
 *                                         enum: []
 *                                       $in:
 *                                         type: array
 *                                         description: Filter by values in this array.
 *                                         items: {}
 *                                       $nin:
 *                                         type: array
 *                                         description: Filter by values not in this array.
 *                                         items: {}
 *                                       $not:
 *                                         oneOf:
 *                                           - type: object
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                           - type: array
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                             items: {}
 *                                       $gt:
 *                                         type: string
 *                                         description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $gte:
 *                                         type: string
 *                                         description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $lt:
 *                                         type: string
 *                                         description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $lte:
 *                                         type: string
 *                                         description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $like:
 *                                         type: string
 *                                         title: $like
 *                                         description: Apply a `like` filter. Useful for strings only.
 *                                       $re:
 *                                         type: string
 *                                         title: $re
 *                                         description: Apply a regex filter. Useful for strings only.
 *                                       $ilike:
 *                                         type: string
 *                                         title: $ilike
 *                                         description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                                       $fulltext:
 *                                         type: string
 *                                         title: $fulltext
 *                                         description: Filter to apply on full-text properties.
 *                                       $overlap:
 *                                         type: array
 *                                         description: Filter arrays that have overlapping values with this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $overlap
 *                                           description: Filter arrays that have overlapping values with this parameter.
 *                                       $contains:
 *                                         type: array
 *                                         description: Filter arrays that contain some of the values of this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $contains
 *                                           description: Filter arrays that contain some of the values of this parameter.
 *                                       $contained:
 *                                         type: array
 *                                         description: Filter arrays that contain all values of this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $contained
 *                                           description: Filter arrays that contain all values of this parameter.
 *                                       $exists:
 *                                         type: boolean
 *                                         title: $exists
 *                                         description: Filter by whether a value for this parameter exists (not `null`).
 *                                   - type: array
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                     items: {}
 *                               $gt:
 *                                 type: string
 *                                 description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                                 enum: []
 *                               $gte:
 *                                 type: string
 *                                 description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                                 enum: []
 *                               $lt:
 *                                 type: string
 *                                 description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                                 enum: []
 *                               $lte:
 *                                 type: string
 *                                 description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                                 enum: []
 *                               $like:
 *                                 type: string
 *                                 title: $like
 *                                 description: Apply a `like` filter. Useful for strings only.
 *                               $re:
 *                                 type: string
 *                                 title: $re
 *                                 description: Apply a regex filter. Useful for strings only.
 *                               $ilike:
 *                                 type: string
 *                                 title: $ilike
 *                                 description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                               $fulltext:
 *                                 type: string
 *                                 title: $fulltext
 *                                 description: Filter to apply on full-text properties.
 *                               $overlap:
 *                                 type: array
 *                                 description: Filter arrays that have overlapping values with this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $overlap
 *                                   description: Filter arrays that have overlapping values with this parameter.
 *                               $contains:
 *                                 type: array
 *                                 description: Filter arrays that contain some of the values of this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $contains
 *                                   description: Filter arrays that contain some of the values of this parameter.
 *                               $contained:
 *                                 type: array
 *                                 description: Filter arrays that contain all values of this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $contained
 *                                   description: Filter arrays that contain all values of this parameter.
 *                               $exists:
 *                                 type: boolean
 *                                 title: $exists
 *                                 description: Filter by whether a value for this parameter exists (not `null`).
 *                           - type: array
 *                             description: Filter by values not matching the conditions in this parameter.
 *                             items: {}
 *                       $gt:
 *                         type: string
 *                         title: $gt
 *                         description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                       $gte:
 *                         type: string
 *                         title: $gte
 *                         description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                       $lt:
 *                         type: string
 *                         title: $lt
 *                         description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                       $lte:
 *                         type: string
 *                         title: $lte
 *                         description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                       $like:
 *                         type: string
 *                         title: $like
 *                         description: Apply a `like` filter. Useful for strings only.
 *                       $re:
 *                         type: string
 *                         title: $re
 *                         description: Apply a regex filter. Useful for strings only.
 *                       $ilike:
 *                         type: string
 *                         title: $ilike
 *                         description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                       $fulltext:
 *                         type: string
 *                         title: $fulltext
 *                         description: Filter to apply on full-text properties.
 *                       $overlap:
 *                         type: array
 *                         description: Filter arrays that have overlapping values with this parameter.
 *                         items:
 *                           type: string
 *                           title: $overlap
 *                           description: Filter arrays that have overlapping values with this parameter.
 *                       $contains:
 *                         type: array
 *                         description: Filter arrays that contain some of the values of this parameter.
 *                         items:
 *                           type: string
 *                           title: $contains
 *                           description: Filter arrays that contain some of the values of this parameter.
 *                       $contained:
 *                         type: array
 *                         description: Filter arrays that contain all values of this parameter.
 *                         items:
 *                           type: string
 *                           title: $contained
 *                           description: Filter arrays that contain all values of this parameter.
 *                       $exists:
 *                         type: boolean
 *                         title: $exists
 *                         description: Filter by whether a value for this parameter exists (not `null`).
 *                   - type: array
 *                     description: Filter by values not matching the conditions in this parameter.
 *                     items:
 *                       type: string
 *                       title: $not
 *                       description: Filter by values not matching the conditions in this parameter.
 *                   - type: object
 *                     description: Filter by values not matching the conditions in this parameter.
 *                     properties:
 *                       $and:
 *                         type: array
 *                         description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                         items:
 *                           type: object
 *                         title: $and
 *                       $or:
 *                         type: array
 *                         description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                         items:
 *                           type: object
 *                         title: $or
 *                       $eq:
 *                         type: array
 *                         description: Filter by an exact match.
 *                         items: {}
 *                       $ne:
 *                         type: string
 *                         description: Filter by values not equal to this parameter.
 *                         enum: []
 *                       $in:
 *                         type: array
 *                         description: Filter by values in this array.
 *                         items: {}
 *                       $nin:
 *                         type: array
 *                         description: Filter by values not in this array.
 *                         items: {}
 *                       $not:
 *                         oneOf:
 *                           - type: object
 *                             description: Filter by values not matching the conditions in this parameter.
 *                             properties:
 *                               $and:
 *                                 type: array
 *                                 description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                 items:
 *                                   type: object
 *                                 title: $and
 *                               $or:
 *                                 type: array
 *                                 description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                 items:
 *                                   type: object
 *                                 title: $or
 *                               $eq:
 *                                 type: array
 *                                 description: Filter by an exact match.
 *                                 items: {}
 *                               $ne:
 *                                 type: string
 *                                 description: Filter by values not equal to this parameter.
 *                                 enum: []
 *                               $in:
 *                                 type: array
 *                                 description: Filter by values in this array.
 *                                 items: {}
 *                               $nin:
 *                                 type: array
 *                                 description: Filter by values not in this array.
 *                                 items: {}
 *                               $not:
 *                                 oneOf:
 *                                   - type: object
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                     properties:
 *                                       $and:
 *                                         type: array
 *                                         description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                         items:
 *                                           type: object
 *                                         title: $and
 *                                       $or:
 *                                         type: array
 *                                         description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                         items:
 *                                           type: object
 *                                         title: $or
 *                                       $eq:
 *                                         type: array
 *                                         description: Filter by an exact match.
 *                                         items: {}
 *                                       $ne:
 *                                         type: string
 *                                         description: Filter by values not equal to this parameter.
 *                                         enum: []
 *                                       $in:
 *                                         type: array
 *                                         description: Filter by values in this array.
 *                                         items: {}
 *                                       $nin:
 *                                         type: array
 *                                         description: Filter by values not in this array.
 *                                         items: {}
 *                                       $not:
 *                                         oneOf:
 *                                           - type: object
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                           - type: array
 *                                             description: Filter by values not matching the conditions in this parameter.
 *                                             items: {}
 *                                       $gt:
 *                                         type: string
 *                                         description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $gte:
 *                                         type: string
 *                                         description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $lt:
 *                                         type: string
 *                                         description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $lte:
 *                                         type: string
 *                                         description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                                         enum: []
 *                                       $like:
 *                                         type: string
 *                                         title: $like
 *                                         description: Apply a `like` filter. Useful for strings only.
 *                                       $re:
 *                                         type: string
 *                                         title: $re
 *                                         description: Apply a regex filter. Useful for strings only.
 *                                       $ilike:
 *                                         type: string
 *                                         title: $ilike
 *                                         description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                                       $fulltext:
 *                                         type: string
 *                                         title: $fulltext
 *                                         description: Filter to apply on full-text properties.
 *                                       $overlap:
 *                                         type: array
 *                                         description: Filter arrays that have overlapping values with this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $overlap
 *                                           description: Filter arrays that have overlapping values with this parameter.
 *                                       $contains:
 *                                         type: array
 *                                         description: Filter arrays that contain some of the values of this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $contains
 *                                           description: Filter arrays that contain some of the values of this parameter.
 *                                       $contained:
 *                                         type: array
 *                                         description: Filter arrays that contain all values of this parameter.
 *                                         items:
 *                                           type: string
 *                                           title: $contained
 *                                           description: Filter arrays that contain all values of this parameter.
 *                                       $exists:
 *                                         type: boolean
 *                                         title: $exists
 *                                         description: Filter by whether a value for this parameter exists (not `null`).
 *                                   - type: array
 *                                     description: Filter by values not matching the conditions in this parameter.
 *                                     items: {}
 *                               $gt:
 *                                 type: string
 *                                 description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                                 enum: []
 *                               $gte:
 *                                 type: string
 *                                 description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                                 enum: []
 *                               $lt:
 *                                 type: string
 *                                 description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                                 enum: []
 *                               $lte:
 *                                 type: string
 *                                 description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                                 enum: []
 *                               $like:
 *                                 type: string
 *                                 title: $like
 *                                 description: Apply a `like` filter. Useful for strings only.
 *                               $re:
 *                                 type: string
 *                                 title: $re
 *                                 description: Apply a regex filter. Useful for strings only.
 *                               $ilike:
 *                                 type: string
 *                                 title: $ilike
 *                                 description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                               $fulltext:
 *                                 type: string
 *                                 title: $fulltext
 *                                 description: Filter to apply on full-text properties.
 *                               $overlap:
 *                                 type: array
 *                                 description: Filter arrays that have overlapping values with this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $overlap
 *                                   description: Filter arrays that have overlapping values with this parameter.
 *                               $contains:
 *                                 type: array
 *                                 description: Filter arrays that contain some of the values of this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $contains
 *                                   description: Filter arrays that contain some of the values of this parameter.
 *                               $contained:
 *                                 type: array
 *                                 description: Filter arrays that contain all values of this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $contained
 *                                   description: Filter arrays that contain all values of this parameter.
 *                               $exists:
 *                                 type: boolean
 *                                 title: $exists
 *                                 description: Filter by whether a value for this parameter exists (not `null`).
 *                           - type: array
 *                             description: Filter by values not matching the conditions in this parameter.
 *                             items: {}
 *                       $gt:
 *                         type: string
 *                         description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                         enum: []
 *                       $gte:
 *                         type: string
 *                         description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                         enum: []
 *                       $lt:
 *                         type: string
 *                         description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                         enum: []
 *                       $lte:
 *                         type: string
 *                         description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                         enum: []
 *                       $like:
 *                         type: string
 *                         title: $like
 *                         description: Apply a `like` filter. Useful for strings only.
 *                       $re:
 *                         type: string
 *                         title: $re
 *                         description: Apply a regex filter. Useful for strings only.
 *                       $ilike:
 *                         type: string
 *                         title: $ilike
 *                         description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                       $fulltext:
 *                         type: string
 *                         title: $fulltext
 *                         description: Filter to apply on full-text properties.
 *                       $overlap:
 *                         type: array
 *                         description: Filter arrays that have overlapping values with this parameter.
 *                         items:
 *                           type: string
 *                           title: $overlap
 *                           description: Filter arrays that have overlapping values with this parameter.
 *                       $contains:
 *                         type: array
 *                         description: Filter arrays that contain some of the values of this parameter.
 *                         items:
 *                           type: string
 *                           title: $contains
 *                           description: Filter arrays that contain some of the values of this parameter.
 *                       $contained:
 *                         type: array
 *                         description: Filter arrays that contain all values of this parameter.
 *                         items:
 *                           type: string
 *                           title: $contained
 *                           description: Filter arrays that contain all values of this parameter.
 *                       $exists:
 *                         type: boolean
 *                         title: $exists
 *                         description: Filter by whether a value for this parameter exists (not `null`).
 *                   - type: array
 *                     description: Filter by values not matching the conditions in this parameter.
 *                     items: {}
 *               $gt:
 *                 type: string
 *                 title: $gt
 *                 description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *               $gte:
 *                 type: string
 *                 title: $gte
 *                 description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *               $lt:
 *                 type: string
 *                 title: $lt
 *                 description: Filter by values less than this parameter. Useful for numbers and dates only.
 *               $lte:
 *                 type: string
 *                 title: $lte
 *                 description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *               $like:
 *                 type: string
 *                 title: $like
 *                 description: Apply a `like` filter. Useful for strings only.
 *               $re:
 *                 type: string
 *                 title: $re
 *                 description: Apply a regex filter. Useful for strings only.
 *               $ilike:
 *                 type: string
 *                 title: $ilike
 *                 description: Apply a case-insensitive `like` filter. Useful for strings only.
 *               $fulltext:
 *                 type: string
 *                 title: $fulltext
 *                 description: Filter to apply on full-text properties.
 *               $overlap:
 *                 type: array
 *                 description: Filter arrays that have overlapping values with this parameter.
 *                 items:
 *                   type: string
 *                   title: $overlap
 *                   description: Filter arrays that have overlapping values with this parameter.
 *               $contains:
 *                 type: array
 *                 description: Filter arrays that contain some of the values of this parameter.
 *                 items:
 *                   type: string
 *                   title: $contains
 *                   description: Filter arrays that contain some of the values of this parameter.
 *               $contained:
 *                 type: array
 *                 description: Filter arrays that contain all values of this parameter.
 *                 items:
 *                   type: string
 *                   title: $contained
 *                   description: Filter arrays that contain all values of this parameter.
 *               $exists:
 *                 type: boolean
 *                 title: $exists
 *                 description: Filter by whether a value for this parameter exists (not `null`).
 *           - type: array
 *             description: Filter by values not matching the conditions in this parameter.
 *             items:
 *               type: string
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *       $gt:
 *         type: string
 *         title: $gt
 *         description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *       $gte:
 *         type: string
 *         title: $gte
 *         description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *       $lt:
 *         type: string
 *         title: $lt
 *         description: Filter by values less than this parameter. Useful for numbers and dates only.
 *       $lte:
 *         type: string
 *         title: $lte
 *         description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *       $like:
 *         type: string
 *         title: $like
 *         description: Apply a `like` filter. Useful for strings only.
 *       $re:
 *         type: string
 *         title: $re
 *         description: Apply a regex filter. Useful for strings only.
 *       $ilike:
 *         type: string
 *         title: $ilike
 *         description: Apply a case-insensitive `like` filter. Useful for strings only.
 *       $fulltext:
 *         type: string
 *         title: $fulltext
 *         description: Filter to apply on full-text properties.
 *       $overlap:
 *         type: array
 *         description: Filter arrays that have overlapping values with this parameter.
 *         items:
 *           type: string
 *           title: $overlap
 *           description: Filter arrays that have overlapping values with this parameter.
 *       $contains:
 *         type: array
 *         description: Filter arrays that contain some of the values of this parameter.
 *         items:
 *           type: string
 *           title: $contains
 *           description: Filter arrays that contain some of the values of this parameter.
 *       $contained:
 *         type: array
 *         description: Filter arrays that contain all values of this parameter.
 *         items:
 *           type: string
 *           title: $contained
 *           description: Filter arrays that contain all values of this parameter.
 *       $exists:
 *         type: boolean
 *         title: $exists
 *         description: Filter by whether a value for this parameter exists (not `null`).
 *   limit:
 *     type: number
 *     title: limit
 *     description: Limit the number of items returned in the list.
 *     externalDocs:
 *       url: "#pagination"
 *   offset:
 *     type: number
 *     title: offset
 *     description: The number of items to skip when retrieving a list.
 *     externalDocs:
 *       url: "#pagination"
 *   order:
 *     type: string
 *     title: order
 *     description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *     externalDocs:
 *       url: "#pagination"
 *   fields:
 *     type: string
 *     title: fields
 *     description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. Without prefix it will replace the entire default fields.
 *     externalDocs:
 *       url: "#select-fields-and-relations"
 *   $and:
 *     type: array
 *     description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *     items:
 *       type: object
 *     title: $and
 *   $or:
 *     type: array
 *     description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *     items:
 *       type: object
 *     title: $or
 * 
*/

